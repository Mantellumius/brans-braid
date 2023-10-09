#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use jwalk::WalkDir;
use std::{
    fs::{self},
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
const BUTCH_SIZE: usize = 150;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_dir, search, stop_search])
        .manage(ThreadCount {
            thread_coutner: Arc::new(Mutex::new(0)),
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
async fn search<R: Runtime>(
    query: String,
    path: String,
    searcher_state: State<'_, ThreadCount>,
    _app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
) -> Result<usize> {
    let thread_count = Arc::clone(&searcher_state.thread_coutner.clone());
    *thread_count.lock().unwrap() += 1;
    let call_number = *thread_count.lock().unwrap();
    let window_clone = window.clone();
    window.listen(
        format!("start_processing_search_call-{}", call_number),
        move |_event| {
            let filter = create_filter(query.clone());
            search_dir(
                path.clone(),
                filter,
                &thread_count,
                call_number,
                &window_clone,
            );
        },
    );
    Ok(call_number)
}

#[tauri::command]
fn stop_search<R: Runtime>(
    searcher_state: State<'_, ThreadCount>,
    _app: tauri::AppHandle<R>,
    _window: tauri::Window<R>,
) -> Result<()> {
    *searcher_state.thread_coutner.lock().unwrap() += 1;
    Ok(())
}
fn search_dir(
    path: String,
    filter: impl Fn(&str) -> bool,
    thread_count: &Arc<Mutex<usize>>,
    call_number: usize,
    window: &tauri::Window<impl Runtime>,
) {
    let event_name = &format!("on_search_result-{}", call_number);
    let mut items = WalkDir::new(path)
        .process_read_dir(|_, _, _, children| {
            children.iter_mut().flatten().for_each(|dir_entry| {
                if !is_valid_filename(get_file_name(dir_entry)) {
                    dir_entry.read_children_path = None;
                }
            });
        })
        .into_iter()
        .flatten()
        .filter(move |entry| filter(get_file_name(entry)))
        .map(move |entry| item::Item::from_jwalk(&entry));
    loop {
        if *thread_count.lock().unwrap() != call_number {
            break;
        }
        let butch = items.by_ref().take(BUTCH_SIZE).collect::<Vec<Item>>();
        if butch.is_empty() || *thread_count.lock().unwrap() != call_number {
            break;
        }
        println!("Send {}", call_number);
        let _ = window.emit(event_name, butch);
    }
    let _ = window.emit(event_name, Vec::<Item>::new());
}

pub fn create_filter(query: String) -> impl Fn(&str) -> bool {
    move |file_name: &str| {
        file_name
            .to_lowercase()
            .contains(&query.clone().to_lowercase())
    }
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
