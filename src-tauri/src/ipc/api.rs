use super::IpcResponse;
use crate::{
    models::{Api, Tag},
    state::ServiceAccess,
    Error,
};
use tauri::{command, AppHandle};

#[command]
pub fn add_tag(app_handle: AppHandle, folder_id: usize, tag_id: usize) -> IpcResponse<()> {
    match app_handle.db(|db| Api::add_tag(db, folder_id, tag_id)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn remove_tag(app_handle: AppHandle, folder_id: usize, tag_id: usize) -> IpcResponse<()> {
    match app_handle.db(|db| Api::remove_tag(db, folder_id, tag_id)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_folder_tags(app_handle: AppHandle, folder_id: usize) -> IpcResponse<Vec<Tag>> {
    match app_handle.db(|db| Api::get_folder_tags(db, folder_id)) {
        Ok(data) => Ok(data).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn update_folder_tags(
    app_handle: AppHandle,
    folder_id: usize,
    tags: Vec<usize>,
) -> IpcResponse<()> {
    match app_handle.db(|db| Api::update_folder_tags(db, folder_id, tags)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn filter_by_tags(app_handle: AppHandle, tags: Vec<u32>) -> IpcResponse<Vec<String>> {
    match app_handle.db(|db| Api::filter_by_tags(db, tags)) {
        Ok(data) => Ok(data).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}
