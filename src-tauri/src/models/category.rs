use rusqlite::{named_params, Connection, Row};
use ts_rs::TS;

#[derive(serde::Serialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
#[serde(rename_all = "camelCase")]
pub struct Category {
    pub id: usize,
    pub name: String,
}

impl Category {
    pub fn create(db: &Connection, name: &str) -> Result<usize, rusqlite::Error> {
        db.prepare("INSERT INTO categories (name) VALUES (@name)")?
            .execute(named_params! { "@name": name })?;
        let id = db.last_insert_rowid();
        Ok(id as usize)
    }

    pub fn delete(db: &Connection, id: usize) -> Result<usize, rusqlite::Error> {
        db.prepare("DELETE FROM categories WHERE id = @id")?
            .execute(named_params! { "@id": id })
    }

    pub fn update(db: &Connection, id: usize, name: &str) -> Result<usize, rusqlite::Error> {
        db.prepare("UPDATE categories SET name = @name WHERE id = @id")?
            .execute(named_params! { "@id": id, "@name": name })
    }

    pub fn get(db: &Connection, id: usize) -> Result<Category, rusqlite::Error> {
        db.prepare("SELECT * FROM categories WHERE id = @id")?
            .query_row(named_params! { "@id": id }, |row| Category::try_from(row))
    }

    pub fn get_all(db: &Connection) -> Result<Vec<Category>, rusqlite::Error> {
        db.prepare("SELECT * FROM categories")?
            .query_map([], |row| Category::try_from(row))?
            .collect()
    }
}

impl TryFrom<&Row<'_>> for Category {
    type Error = rusqlite::Error;

    fn try_from(row: &Row<'_>) -> Result<Self, Self::Error> {
        Ok(Category {
            id: row.get("id")?,
            name: row.get("name")?,
        })
    }
}
