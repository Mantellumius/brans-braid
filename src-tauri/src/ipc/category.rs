use super::IpcResponse;
use crate::Error;
use crate::state::AppState;
use crate::{models::Category, state::ServiceAccess};
use tauri::{command, State};

#[command]
pub fn create_category(app_state: State<AppState>, name: &str) -> IpcResponse<usize> {
    match app_state.db_map(|db| Category::create(db, name)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn delete_category(app_state: State<AppState>, id: usize) -> IpcResponse<usize> {
    match app_state.db_map(|db| Category::delete(db, id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn update_category(app_state: State<AppState>, id: usize, name: &str) -> IpcResponse<usize> {
    match app_state.db_map(|db| Category::update(db, id, name)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_category(app_state: State<AppState>, id: usize) -> IpcResponse<Category> {
    match app_state.db_map(|db| Category::get(db, id)) {
        Ok(category) => Ok(category).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_categories(app_state: State<AppState>) -> IpcResponse<Vec<Category>> {
    match app_state.db_map(Category::get_all) {
        Ok(category) => Ok(category).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}
