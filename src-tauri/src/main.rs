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
    collections::HashMap,
    fs::{self},
    path::Path,
};
use tauri::{api::process::Command, AppHandle, Manager, Runtime, State, Window};
use window_shadows::set_shadow;

fn main() {
    app_lib::run();
    
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
    Ok(searcher.update_folder_iterator(&path, depth, query)).into()
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

#[tauri::command(async)]
fn analyze_languages<R: Runtime>(
    path: String,
    _app: tauri::AppHandle<R>,
    _window: tauri::Window<R>,
) -> IpcResponse<HashMap<String, Vec<String>>> {
    let iterator = Searcher::create_folder_iterator(&path, 100000000000);
    let mut result = HashMap::<String, Vec<String>>::new();
    iterator
        .filter(|dir| dir.metadata().unwrap().is_file())
        .map(|dir| Item::try_from(&dir).unwrap())
        .for_each(|item| {
            result
                .entry(item.extension)
                .or_insert(vec![])
                .push(item.path);
        });
    Ok(result).into()
}

// #[tauri::command(async)]
// fn analyze_languages<R: Runtime>(
//     path: String,
//     _app: tauri::AppHandle<R>,
//     _window: tauri::Window<R>,
// ) -> IpcResponse<Vec<String>> {
//     let iterator = Searcher::create_folder_iterator(&path, 100000000000);
//     let result = iterator
//         .filter(|dir| dir.metadata().unwrap().is_file())
//         .map(|dir| Item::try_from(&dir).unwrap().path)
//         .collect();
//     Ok(result).into()
// }

fn execute_command(command: &str, args: Vec<&str>) {
    Command::new("cmd")
        .args([vec!["/C", command], args].concat())
        .spawn()
        .expect("Failed to execute command");
}
