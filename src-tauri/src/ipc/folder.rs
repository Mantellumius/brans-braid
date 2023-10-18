use super::IpcResponse;
use crate::{models::Folder, state::{ServiceAccess, AppState}, Error};
use tauri::{command, State};

#[command]
pub fn create_folder(app_state: State<AppState>, path: &str) -> IpcResponse<usize> {
    match app_state.db_map(|db| Folder::create(db, path)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_or_create_folder(app_state: State<AppState>, path: &str) -> IpcResponse<Folder> {
    match app_state.db_map(|db| Folder::get_or_create(db, path)) {
        Ok(folder) => Ok(folder).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn delete_folder(app_state: State<AppState>, id: usize) -> IpcResponse<usize> {
    match app_state.db_map(|db| Folder::delete(db, id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn update_folder(app_state: State<AppState>, id: usize, name: &str) -> IpcResponse<usize> {
    match app_state.db_map(|db| Folder::update(db, id, name)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_folder_by_path(app_state: State<AppState>, path: &str) -> IpcResponse<Folder> {
    match app_state.db_map(|db| Folder::get_by_path(db, path)) {
        Ok(folder) => Ok(folder).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_folder(app_state: State<AppState>, id: usize) -> IpcResponse<Folder> {
    match app_state.db_map(|db| Folder::get(db, id)) {
        Ok(folder) => Ok(folder).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_folders(app_state: State<AppState>) -> IpcResponse<Vec<Folder>> {
    match app_state.db_map(Folder::get_all) {
        Ok(folders) => Ok(folders).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}
