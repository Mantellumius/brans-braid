use crate::{models::Folder, state::ServiceAccess};
use tauri::{command, AppHandle};

#[command]
pub fn create_folder(app_handle: AppHandle, name: &str) {
    app_handle.db(|db| Folder::create(db, name)).unwrap();
}

#[command]
pub fn delete_folder(app_handle: AppHandle, id: usize) {
    app_handle.db(|db| Folder::delete(db, id)).unwrap();
}

#[command]
pub fn update_folder(app_handle: AppHandle, id: usize, name: &str) {
	app_handle.db(|db| Folder::update(db, id, name)).unwrap();
}

#[command]
pub fn get_folder(app_handle: AppHandle, id: usize) -> Folder {
	app_handle.db(|db| Folder::get(db, id)).unwrap()
}

#[command]
pub fn get_folders(app_handle: AppHandle) -> Vec<Folder> {
    app_handle.db(Folder::get_all).unwrap()
}