use rusqlite::{named_params, Connection, Result};

#[derive(serde::Serialize)]
pub struct Api {}

impl Api {
    pub fn add_tag(db: &Connection, folder_id: usize, tag_id: usize) -> Result<usize> {
        db.prepare("INSERT INTO tag_folder (tag_id, folder_id) VALUES (@tag_id, @folder_id)")?
            .execute(named_params! { "@folder_id": folder_id, "@tag_id": tag_id })
    }
}
