use super::IpcResponse;
use crate::{models::Folder, state::ServiceAccess, Error};
use tauri::{command, AppHandle};

#[command]
pub fn create_folder(app_handle: AppHandle, name: &str) -> IpcResponse<usize> {
    match app_handle.db(|db| Folder::create(db, name)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn delete_folder(app_handle: AppHandle, id: usize) -> IpcResponse<usize> {
    match app_handle.db(|db| Folder::delete(db, id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn update_folder(app_handle: AppHandle, id: usize, name: &str) -> IpcResponse<usize> {
    match app_handle.db(|db| Folder::update(db, id, name)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_folder(app_handle: AppHandle, id: usize) -> IpcResponse<Folder> {
    match app_handle.db(|db| Folder::get(db, id)) {
        Ok(folder) => Ok(folder).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_folders(app_handle: AppHandle) -> IpcResponse<Vec<Folder>> {
    match app_handle.db(Folder::get_all) {
        Ok(folders) => Ok(folders).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}
