use crate::{models::Tag, state::ServiceAccess};
use tauri::{command, AppHandle};

#[command]
pub fn create_tag(app_handle: AppHandle, name: &str, category_id: usize) {
    app_handle.db(|db| Tag::create(db, name, category_id)).unwrap();
}

#[command]
pub fn delete_tag(app_handle: AppHandle, id: usize) {
    app_handle.db(|db| Tag::delete(db, id)).unwrap();
}

#[command]
pub fn update_tag(app_handle: AppHandle, id: usize, name: &str, category_id: usize) {
	app_handle.db(|db| Tag::update(db, id, name, category_id)).unwrap();
}

#[command]
pub fn get_tag(app_handle: AppHandle, id: usize) -> Tag {
	app_handle.db(|db| Tag::get(db, id)).unwrap()
}

#[command]
pub fn get_tags(app_handle: AppHandle) -> Vec<Tag> {
    app_handle.db(Tag::get_all).unwrap()
}