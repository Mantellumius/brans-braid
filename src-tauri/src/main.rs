#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::{
    ffi::OsStr,
    fs::{self, DirEntry},
};
use tauri::*;

#[derive(Debug, serde::Serialize)]
struct Item {
    path: String,
    name: String,
    is_dir: bool,
    is_file: bool,
    have_access: bool,
    extension: String,
}

impl Item {
    fn from(dir: &DirEntry) -> Self {
        Item {
            path: dir.path().to_str().unwrap().to_string(),
            name: dir.file_name().to_str().unwrap().to_string(),
            is_dir: dir.path().is_dir(),
            is_file: dir.path().is_file(),
            have_access: dir.metadata().unwrap().permissions().readonly(),
            extension: get_extension(dir),
        }
    }
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_extension(dir: &DirEntry) -> String {
    if dir.file_type().unwrap().is_dir() {
        return String::new();
    }
    dir.path()
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_string_lossy()
        .to_string()
}
