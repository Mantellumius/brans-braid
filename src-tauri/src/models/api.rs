use std::rc::Rc;

use rusqlite::{named_params, types::Value, Connection, Result};

#[derive(serde::Serialize)]
pub struct Api {}

impl Api {
    pub fn add_tag(db: &Connection, folder_id: usize, tag_id: usize) -> Result<usize> {
        db.prepare("INSERT INTO folder_tag (tag_id, folder_id) VALUES (@tag_id, @folder_id)")?
            .execute(named_params! { "@folder_id": folder_id, "@tag_id": tag_id })
    }

    pub fn remove_tag(db: &Connection, folder_id: usize, tag_id: usize) -> Result<usize> {
        db.prepare("DELETE FROM folder_tag WHERE tag_id = @tag_id AND folder_id = @folder_id")?
            .execute(named_params! { "@folder_id": folder_id, "@tag_id": tag_id })
    }

    pub fn filter_by_tags(db: &Connection, tags: Vec<u32>) -> Result<Vec<String>> {
        let tags = Rc::new(tags.into_iter().map(Value::from).collect::<Vec<Value>>());
        db.prepare(
            r"SELECT folders.path
FROM folder_tag
JOIN folders ON folders.id = folder_id
WHERE tag_id IN rarray(@tags)
GROUP BY folder_id
HAVING COUNT(DISTINCT tag_id) = @tags_count",
        )?
        .query_map(
            named_params! {"@tags": &tags, "@tags_count": tags.len()},
            |row| row.get(0),
        )?
        .collect()
    }
}
