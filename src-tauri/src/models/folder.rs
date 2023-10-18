use rusqlite::{named_params, Connection, Result, Row};
use ts_rs::TS;

#[derive(serde::Serialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
#[serde(rename_all = "camelCase")]
pub struct Folder {
    id: usize,
    path: String,
}

impl Folder {
    pub fn create(db: &Connection, path: &str) -> Result<usize> {
        db.prepare("INSERT INTO folders (path) VALUES (@path)")?
            .execute(named_params! { "@path": path })
    }

    pub fn get_or_create(db: &Connection, path: &str) -> Result<Folder> {
        let folder = Folder::get_by_path(db, path);
        match folder {
            Ok(folder) => Ok(folder),
            Err(_) => Folder::get(db, Folder::create(db, path)?),
        }
    }

    pub fn delete(db: &Connection, id: usize) -> Result<usize> {
        db.prepare("DELETE FROM folders WHERE id = @id")?
            .execute(named_params! { "@id": id })
    }

    pub fn update(db: &Connection, id: usize, path: &str) -> Result<usize> {
        db.prepare("UPDATE folders SET path = @path WHERE id = @id")?
            .execute(named_params! { "@id": id, "@path": path })
    }

    pub fn get(db: &Connection, id: usize) -> Result<Folder> {
        db.prepare("SELECT * FROM folders WHERE id = @id")?
            .query_row(named_params! { "@id": id }, |row| Folder::try_from(row))
    }

    pub fn get_by_path(db: &Connection, path: &str) -> Result<Folder> {
        db.prepare("SELECT * FROM folders WHERE path = @path")?
            .query_row(named_params! { "@path": path }, |row| Folder::try_from(row))
    }

    pub fn get_all(db: &Connection) -> Result<Vec<Folder>> {
        db.prepare("SELECT * FROM folders")?
            .query_map([], |row| Folder::try_from(row))?
            .collect()
    }
}

impl TryFrom<&Row<'_>> for Folder {
    type Error = rusqlite::Error;

    fn try_from(row: &Row<'_>) -> std::result::Result<Self, Self::Error> {
        Ok(Folder {
            id: row.get("id")?,
            path: row.get("path")?,
        })
    }
}
