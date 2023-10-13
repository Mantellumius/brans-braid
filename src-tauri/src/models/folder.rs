use rusqlite::{named_params, Connection, Result};

#[derive(serde::Serialize)]
pub struct Folder {
    id: usize,
    path: String,
}

impl Folder {
    pub fn create(db: &Connection, path: &str) -> Result<()> {
        db.prepare("INSERT INTO categories (path) VALUES (@path)")?
            .execute(named_params! { "@path": path })?;
        Ok(())
    }

    pub fn delete(db: &Connection, id: usize) -> Result<()> {
        db.prepare("DELETE FROM categories WHERE id = @id")?
            .execute(named_params! { "@id": id })?;
        Ok(())
    }

    pub fn update(db: &Connection, id: usize, path: &str) -> Result<()> {
        db.prepare("UPDATE categories SET path = @path WHERE id = @id")?
            .execute(named_params! { "@id": id, "@path": path })?;
        Ok(())
    }

	pub fn get(db: &Connection, id: usize) -> Result<Folder> {
		db.prepare("SELECT * FROM categories WHERE id = @id")?
			.query_row(named_params! { "@id": id }, |r| {
				Ok(Folder {
					id: r.get("id").unwrap(),
					path: r.get("path").unwrap(),
				})
			})
	}

    pub fn get_all(db: &Connection) -> Result<Vec<Folder>> {
        db.prepare("SELECT * FROM categories")?
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
