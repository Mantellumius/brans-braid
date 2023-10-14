use crate::{models::Tag, state::ServiceAccess, Error};
use tauri::{command, AppHandle};

use super::IpcResponse;

#[command]
pub fn create_tag(app_handle: AppHandle, name: &str, category_id: usize) -> IpcResponse<usize> {
    match app_handle.db(|db| Tag::create(db, name, category_id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn delete_tag(app_handle: AppHandle, id: usize) -> IpcResponse<usize> {
    match app_handle.db(|db| Tag::delete(db, id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn update_tag(
    app_handle: AppHandle,
    id: usize,
    name: &str,
    category_id: usize,
) -> IpcResponse<usize> {
    match app_handle.db(|db| Tag::update(db, id, name, category_id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_tag(app_handle: AppHandle, id: usize) -> IpcResponse<Tag> {
    match app_handle.db(|db| Tag::get(db, id)) {
        Ok(tag) => Ok(tag).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_tags(app_handle: AppHandle) -> IpcResponse<Vec<Tag>> {
    match app_handle.db(Tag::get_all) {
        Ok(tags) => Ok(tags).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}
