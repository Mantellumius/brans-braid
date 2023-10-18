use crate::{models::Tag, state::{ServiceAccess, AppState}, Error};
use tauri::{command, State};

use super::IpcResponse;

#[command]
pub fn create_tag(
    app_state: State<AppState>,
    name: &str,
    category_id: usize,
) -> IpcResponse<usize> {
    match app_state.db_map(|db| Tag::create(db, name, category_id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn delete_tag(app_state: State<AppState>, id: usize) -> IpcResponse<usize> {
    match app_state.db_map(|db| Tag::delete(db, id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn update_tag(
    app_state: State<AppState>,
    id: usize,
    name: &str,
    category_id: usize,
) -> IpcResponse<usize> {
    match app_state.db_map(|db| Tag::update(db, id, name, category_id)) {
        Ok(id) => Ok(id).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_tag(app_state: State<AppState>, id: usize) -> IpcResponse<Tag> {
    match app_state.db_map(|db| Tag::get(db, id)) {
        Ok(tag) => Ok(tag).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_tags(app_state: State<AppState>) -> IpcResponse<Vec<Tag>> {
    match app_state.db_map(Tag::get_all) {
        Ok(tags) => Ok(tags).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}
