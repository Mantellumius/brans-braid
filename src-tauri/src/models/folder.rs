use rusqlite::{named_params, Connection, Result};
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
			.query_row(named_params! { "@id": id }, |r| {
				Ok(Folder {
					id: r.get("id").unwrap(),
					path: r.get("path").unwrap(),
				})
			})
	}

    pub fn get_all(db: &Connection) -> Result<Vec<Folder>> {
        db.prepare("SELECT * FROM folders")?
            .query_map([], |r| {
                Ok(Folder {
                    id: r.get("id").unwrap(),
                    path: r.get("path").unwrap(),
                })
            })
            .unwrap()
            .collect()
    }
}
