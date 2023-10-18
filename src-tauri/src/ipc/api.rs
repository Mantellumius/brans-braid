use super::IpcResponse;
use crate::{
    models::{Api, Tag},
    state::{AppState, ServiceAccess},
    Error,
};
use tauri::{command, State};

#[command]
pub fn add_tag(app_state: State<AppState>, folder_id: usize, tag_id: usize) -> IpcResponse<()> {
    match app_state.db_map(|db| Api::add_tag(db, folder_id, tag_id)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn remove_tag(app_state: State<AppState>, folder_id: usize, tag_id: usize) -> IpcResponse<()> {
    match app_state.db_map(|db| Api::remove_tag(db, folder_id, tag_id)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn get_folder_tags(app_state: State<AppState>, folder_id: usize) -> IpcResponse<Vec<Tag>> {
    match app_state.db_map(|db| Api::get_folder_tags(db, folder_id)) {
        Ok(data) => Ok(data).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn update_folder_tags(
    app_state: State<AppState>,
    folder_id: usize,
    tags: Vec<usize>,
) -> IpcResponse<()> {
    match app_state.db_map(|db| Api::update_folder_tags(db, folder_id, tags)) {
        Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}

#[command]
pub fn filter_by_tags(app_state: State<AppState>, tags: Vec<u32>) -> IpcResponse<Vec<String>> {
    match app_state.db_map(|db| Api::filter_by_tags(db, tags)) {
        Ok(data) => Ok(data).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
    }
}
