#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod database;
mod error;
mod ipc;
mod models;
mod searcher;
mod state;
mod utils;

pub use error::{Error, Result};

use ipc::{api, category, folder, tags, IpcResponse};
use models::*;
use searcher::Searcher;
use state::AppState;
use std::{
    fs::{self},
    path::Path,
    sync::{Arc, Mutex},
};
use window_shadows::set_shadow;
use tauri::{api::process::Command, AppHandle, Manager, Runtime, State, Window};

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
            folder::get_folder_by_path,
            folder::get_folder,
            folder::get_or_create_folder,
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
            api::get_folder_tags,
            api::update_folder_tags
        ])
        .manage(AppState {
            searcher: Arc::new(Mutex::new(Searcher::default())),
            db: Default::default(),
        })
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&window, true).unwrap();
            let handle = app.handle();
            let db_state: State<AppState> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Database initialize should succeed");
            *db_state.db.lock().unwrap() = Some(db);
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
            .flatten()
            .map(|entry| serde_json::to_value(Item::try_from(&entry).unwrap()).unwrap())
            .collect())
        .into(),
        Err(e) => Err(Error::IO(e)).into(),
    }
}

#[tauri::command]
fn create_searcher<R: Runtime>(
    path: String,
    depth: usize,
    query: String,
    app_state: State<AppState>,
    _app: AppHandle<R>,
    _window: Window<R>,
) -> IpcResponse<usize> {
    let mut searcher = app_state.searcher.lock().unwrap();
    Ok(searcher.update_folder_iterator(path, depth, query)).into()
}

#[tauri::command]
fn get_folders_info<R: Runtime>(
    folders: Vec<String>,
    _app: AppHandle<R>,
    _window: Window<R>,
) -> IpcResponse<Vec<Item>> {
    Ok(folders
        .iter()
        .flat_map(|path_str| Item::try_from(Path::new(&path_str)))
        .collect())
    .into()
}

#[tauri::command(async)]
fn get_search_results<R: Runtime>(
    app_state: State<AppState>,
    _app: AppHandle<R>,
    _window: Window<R>,
) -> IpcResponse<Vec<Item>> {
    let searcher = app_state.searcher.lock().unwrap();
    Ok(searcher.get_results()).into()
}

fn execute_command(command: &str, args: Vec<&str>) {
    Command::new("cmd")
        .args([vec!["/C", command], args].concat())
        .spawn()
        .expect("Failed to execute command");
}

