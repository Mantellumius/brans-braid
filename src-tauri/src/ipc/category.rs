use super::IpcResponse;
use crate::Error;
use crate::{models::Category, state::ServiceAccess};
use tauri::{command, AppHandle};

#[command]
pub fn create_category(app_handle: AppHandle, name: &str) -> IpcResponse<()> {
    match app_handle.db(|db| Category::create(db, name)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn delete_category(app_handle: AppHandle, id: usize) -> IpcResponse<()> {
    match app_handle.db(|db| Category::delete(db, id)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn update_category(app_handle: AppHandle, id: usize, name: &str) -> IpcResponse<()> {
    match app_handle.db(|db| Category::update(db, id, name)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_category(app_handle: AppHandle, id: usize) -> IpcResponse<Category> {
    match app_handle.db(|db| Category::get(db, id)) {
        Ok(category) => Ok(category).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_categories(app_handle: AppHandle) -> IpcResponse<Vec<Category>> {
    match app_handle.db(Category::get_all) {
        Ok(category) => Ok(category).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}
