use tauri::command;
use crate::{models::Api, state::ServiceAccess};

#[command]
pub fn add_tag(app_handle: AppHandle, folder_id: usize, tag_id: usize) -> IpcResponse<()> {
    match app_handle.db(|db| Api::add_tag(db, folder_id, tag_id)) {
		Ok(_) => Ok(()).into(),
        Err(e) => Err(Error::Sqlite(e)).into(),
	}
}