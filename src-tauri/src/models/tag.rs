use rusqlite::{named_params, Connection, Row};
use ts_rs::TS;

#[derive(serde::Serialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
#[serde(rename_all = "camelCase")]
pub struct Tag {
    pub id: usize,
    pub name: String,
    pub category_id: usize,
}

impl Tag {
    pub fn create(
        db: &Connection,
        name: &str,
        category_id: usize,
    ) -> Result<usize, rusqlite::Error> {
        db.prepare("INSERT INTO tags (name, category_id) VALUES (@name, @category_id)")?
            .execute(named_params! { "@name": name, "@category_id": category_id })?;
        let id = db.last_insert_rowid() as usize;
        Ok(id)
    }

    pub fn delete(db: &Connection, id: usize) -> Result<usize, rusqlite::Error> {
        db.prepare("DELETE FROM tags WHERE id = @id")?
            .execute(named_params! { "@id": id })
    }

    pub fn update(
        db: &Connection,
        id: usize,
        name: &str,
        category_id: usize,
    ) -> Result<usize, rusqlite::Error> {
        db.prepare("UPDATE tags SET name = @name, category_id = @category_id WHERE id = @id")?
            .execute(named_params! { "@id": id, "@name": name, "@category_id": category_id })
    }

    pub fn get(db: &Connection, id: usize) -> Result<Tag, rusqlite::Error> {
        db.prepare("SELECT * FROM tags WHERE id = @id")?
            .query_row(named_params! { "@id": id }, |row| Tag::try_from(row))
    }

    pub fn get_all(db: &Connection) -> Result<Vec<Tag>, rusqlite::Error> {
        db.prepare("SELECT * FROM tags")?
            .query_map([], |row| Tag::try_from(row))?
            .collect()
    }
}

impl TryFrom<&Row<'_>> for Tag {
    type Error = rusqlite::Error;

    fn try_from(row: &Row<'_>) -> Result<Self, Self::Error> {
        Ok(Tag {
            id: row.get("id")?,
            name: row.get("name")?,
            category_id: row.get("category_id")?,
        })
    }
}
