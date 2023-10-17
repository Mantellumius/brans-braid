#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod database;
mod error;
mod ipc;
mod models;
mod state;
mod utils;

pub use error::{Error, Result};

use ipc::{api, category, folder, tags, IpcResponse};
use jwalk::{DirEntryIter, WalkDir};
use models::*;
use state::DbConnection;
use std::{
    fs::{self},
    iter::Flatten,
    path::Path,
    sync::{Arc, Mutex},
};
use tauri::{api::process::Command, AppHandle, Manager, Runtime, State, Window};
use utils::*;
const BUTCH_SIZE: usize = 10;

type FolderIterator = Flatten<DirEntryIter<((), ())>>;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_context_menu::init())
        .invoke_handler(tauri::generate_handler![
            read_dir,
            create_searcher,
            get_search_results,
            get_folders_info,
            code,
            category::create_category,
            category::get_categories,
            category::get_category,
            category::delete_category,
            category::update_category,
            folder::create_folder,
            folder::get_folders,
            folder::get_folder,
            folder::delete_folder,
            folder::update_folder,
            tags::create_tag,
            tags::get_tags,
            tags::get_tag,
            tags::delete_tag,
            tags::update_tag,
            api::filter_by_tags,
            api::add_tag,
            api::remove_tag,
        ])
        .manage(ThreadCount {
            thread_coutner: Arc::new(Mutex::new(0)),
        })
        .manage(SearcherState {
            iterator: Arc::new(Mutex::new(create_folder_iterator("".to_string(), 1))),
        })
        .manage(DbConnection {
            db: Default::default(),
        })
        .setup(|app| {
            let handle = app.handle();
            let app_state: State<DbConnection> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Database initialize should succeed");
            *app_state.db.lock().unwrap() = Some(db);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn code<R: Runtime>(path: &str, _app: AppHandle<R>, _window: Window<R>) -> IpcResponse<()> {
    execute_command("code", vec![path]);
    Ok(()).into()
}

#[tauri::command]
fn read_dir(path: &str) -> IpcResponse<Vec<serde_json::Value>> {
    match fs::read_dir(path) {
        Ok(folders) => Ok(folders
            .map(|entry| serde_json::to_value(Item::from(&entry.unwrap())).unwrap())
            .collect())
        .into(),
        Err(e) => Err(Error::IO(e)).into(),
    }
}

#[tauri::command]
fn create_searcher<R: Runtime>(
    path: String,
    depth: usize,
    iterators: State<SearcherState>,
    searcher_state: State<ThreadCount>,
    _app: AppHandle<R>,
    _window: Window<R>,
) -> IpcResponse<usize> {
    let thread_count = Arc::clone(&searcher_state.thread_coutner.clone());
    *thread_count.lock().unwrap() += 1;
    let searcher_number = *thread_count.lock().unwrap();
    let mut iterator = iterators.iterator.lock().unwrap();
    *iterator = create_folder_iterator(path.clone(), depth);
    Ok(searcher_number).into()
}

#[tauri::command]
fn get_folders_info<R: Runtime>(
    folders: Vec<String>,
    _app: AppHandle<R>,
    _window: Window<R>,
) -> IpcResponse<Vec<Item>> {
    let mut items = Vec::<Item>::new();
    for path_str in folders {
        let path = Path::new(&path_str);
        let metadata = fs::metadata(path).unwrap();
        items.push(Item {
            path: path_str.clone(),
            name: path.file_name().unwrap().to_str().unwrap().to_string(),
            is_dir: metadata.is_dir(),
            is_file: metadata.is_file(),
            have_access: metadata.permissions().readonly(),
            extension: String::new(),
        });
    }
    Ok(items).into()
}

#[tauri::command(async)]
fn get_search_results<R: Runtime>(
    query: String,
    searcher_number: usize,
    searcher_state: State<'_, ThreadCount>,
    iterators: State<'_, SearcherState>,
    _app: AppHandle<R>,
    _window: Window<R>,
) -> IpcResponse<Vec<Item>> {
    let mut iterator = iterators.iterator.lock().unwrap();
    let query = query.clone().to_lowercase();
    let thread_count = Arc::clone(&searcher_state.thread_coutner.clone());
    let mut result = Vec::<Item>::new();
    while *thread_count.lock().unwrap() == searcher_number {
        let entry = iterator.next();
        match entry {
            Some(entry) => {
                if get_file_name(&entry).to_lowercase().contains(&query) {
                    result.push(Item::from_jwalk(&entry));
                    if result.len() >= BUTCH_SIZE {
                        return Ok(result).into();
                    }
                }
            }
            None => {
                return Ok(result).into();
            }
        }
    }
    Ok(Vec::<Item>::new()).into()
}

fn create_folder_iterator(path: String, depth: usize) -> FolderIterator {
    WalkDir::new(path)
        .parallelism(jwalk::Parallelism::RayonNewPool(8))
        .min_depth(1)
        .max_depth(depth)
        .process_read_dir(|_, _, _, children| {
            children.iter_mut().flatten().for_each(|dir_entry| {
                if !is_valid_filename(get_file_name(dir_entry)) {
                    dir_entry.read_children_path = None;
                }
            });
        })
        .try_into_iter()
        .unwrap()
        .flatten()
}

fn execute_command(command: &str, args: Vec<&str>) {
    Command::new("cmd")
        .args([vec!["/C", command], args].concat())
        .spawn()
        .expect("Failed to execute command");
}

struct ThreadCount {
    pub thread_coutner: Arc<Mutex<usize>>,
}

struct SearcherState {
    pub iterator: Arc<Mutex<FolderIterator>>,
}
