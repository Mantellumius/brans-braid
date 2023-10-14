use rusqlite::{named_params, params, Connection, Result};

#[derive(serde::Serialize)]
pub struct Api {}

impl Api {
    pub fn add_tag(db: &Connection, folder_id: usize, tag_id: usize) -> Result<usize> {
        db.prepare("INSERT INTO tag_folder (tag_id, folder_id) VALUES (@tag_id, @folder_id)")?
            .execute(named_params! { "@folder_id": folder_id, "@tag_id": tag_id })
    }

    pub fn remove_tag(db: &Connection, folder_id: usize, tag_id: usize) -> Result<usize> {
        db.prepare("DELETE FROM tag_folder WHERE tag_id = @tag_id AND folder_id = @folder_id")?
            .execute(named_params! { "@folder_id": folder_id, "@tag_id": tag_id })
    }

    pub fn filter_by_tags(db: &Connection, tags: Vec<usize>) -> Result<Vec<String>> {
        let ids = tags.iter()
                .map(|&x| x.to_string())
                .collect::<Vec<String>>()
                .join(", ");
        db.prepare(&format!(
            r"SELECT folders.path
FROM folder_tag
JOIN folders ON folders.id = folder_id
WHERE tag_id IN ({})
GROUP BY folder_id
HAVING COUNT(DISTINCT tag_id) = {}",
            ids, tags.len()
        ))?
        .query_map(params![], |row| row.get(0))?
        .collect()
    }
}
