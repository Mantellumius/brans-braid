#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod item;
mod searcher;
mod utils;
use item::Item;
use jwalk::{DirEntryIter, WalkDir};
use std::{
    fs::{self},
    iter::Flatten,
    sync::{Arc, Mutex},
};
use tauri::*;
use utils::*;

const BUTCH_SIZE: usize = 10;

type FolderIterator = Flatten<DirEntryIter<((), ())>>;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_dir,
            create_searcher,
            get_search_results
        ])
        .manage(ThreadCount {
            thread_coutner: Arc::new(Mutex::new(0)),
        })
        .manage(SearcherState {
            iterator: Arc::new(Mutex::new(create_folder_iterator("".to_string()))),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn read_dir(path: &str) -> Result<Vec<serde_json::Value>> {
    match fs::read_dir(path) {
        Ok(folders) => Ok(folders
            .map(|entry| serde_json::to_value(Item::from(&entry.unwrap())).unwrap())
            .collect()),
        Err(e) => Err(Error::Io(e)),
    }
}

#[tauri::command]
fn create_searcher<R: Runtime>(
    iterators: State<'_, SearcherState>,
    path: String,
    searcher_state: State<'_, ThreadCount>,
    _app: tauri::AppHandle<R>,
    _window: tauri::Window<R>,
) -> Result<usize> {
    let thread_count = Arc::clone(&searcher_state.thread_coutner.clone());
    *thread_count.lock().unwrap() += 1;
    let searcher_number = *thread_count.lock().unwrap();
    let mut iterator = iterators.iterator.lock().unwrap();
    *iterator = create_folder_iterator(path.clone());
    Ok(searcher_number)
}

#[tauri::command]
async fn get_search_results<R: Runtime>(
    query: String,
    searcher_number: usize,
    searcher_state: State<'_, ThreadCount>,
    iterators: State<'_, SearcherState>,
    _app: tauri::AppHandle<R>,
    _window: tauri::Window<R>,
) -> Result<Vec<Item>> {
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
                        return Ok(result);
                    }
                }
            }
            None => {
                return Ok(Vec::<Item>::new());
            }
        }
    }
    Ok(Vec::<Item>::new())
}

fn create_folder_iterator(path: String) -> FolderIterator {
    WalkDir::new(path)
        .parallelism(jwalk::Parallelism::RayonNewPool(8))
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

struct ThreadCount {
    pub thread_coutner: Arc<Mutex<usize>>,
}

struct SearcherState {
    pub iterator: Arc<Mutex<FolderIterator>>,
}
