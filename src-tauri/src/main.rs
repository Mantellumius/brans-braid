#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use jwalk::{DirEntry, DirEntryIter, WalkDir};
use std::{
    fs::{self},
    iter::{Filter, Flatten, Map},
    sync::{Arc, Mutex},
};
use tauri::*;
mod item;
mod searcher;
use item::Item;

const INVALID_DIRS: [&str; 7] = [
    ".git",
    "venv",
    ".idea",
    "node_modules",
    "Library",
    "Debug",
    "postgres",
];

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
            iterator: Arc::new(Mutex::new(search_dir("".to_string()))),
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
    let searcher_number = *thread_count.lock().unwrap();
    let mut iterator = iterators.iterator.lock().unwrap();
    *iterator = search_dir(path.clone());
    *thread_count.lock().unwrap() += 1;
    Ok(searcher_number)
}

#[tauri::command]
async fn get_search_results<R: Runtime>(
    query: String,
    iterators: State<'_, SearcherState>,
    _app: tauri::AppHandle<R>,
    _window: tauri::Window<R>,
) -> Result<Vec<Item>> {
    let mut iterator = iterators.iterator.lock().unwrap();
    let query = query.clone().to_lowercase();
    Ok(iterator
        .by_ref()
        .filter(move |entry| get_file_name(entry).to_lowercase().contains(&query))
        .take(BUTCH_SIZE)
        .map(move |entry| item::Item::from_jwalk(&entry))
        .collect::<Vec<Item>>())
}

fn search_dir(path: String) -> FolderIterator {
    WalkDir::new(path)
        .process_read_dir(|_, _, _, children| {
            children.iter_mut().flatten().for_each(|dir_entry| {
                if !is_valid_filename(get_file_name(dir_entry)) {
                    dir_entry.read_children_path = None;
                }
            });
        })
        .into_iter()
        .flatten()
}

fn is_valid_filename(filename: &str) -> bool {
    !INVALID_DIRS.iter().any(|&dir| filename == dir)
}

fn get_file_name(entry: &jwalk::DirEntry<((), ())>) -> &str {
    entry.file_name().to_str().unwrap()
}

struct ThreadCount {
    pub thread_coutner: Arc<Mutex<usize>>,
}

struct SearcherState {
    pub iterator: Arc<Mutex<FolderIterator>>,
}
