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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_context_menu::init())
        .invoke_handler(tauri::generate_handler![
            read_dir,
            create_searcher,
            get_search_results,
            get_folders_info,
            analyze_languages,
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
        .manage(AppState::default())
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
