use rusqlite::{named_params, Connection};

#[derive(serde::Serialize)]
pub struct Category {
    pub id: usize,
    pub name: String,
}

impl Category {
    pub fn create(db: &Connection, name: &str) -> Result<(), rusqlite::Error> {
        db.prepare("INSERT INTO categories (name) VALUES (@name)")?
            .execute(named_params! { "@name": name })?;
        Ok(())
    }

	pub fn delete(db: &Connection, id: usize) -> Result<(), rusqlite::Error> {
		db.prepare("DELETE FROM categories WHERE id = @id")?
			.execute(named_params! { "@id": id })?;
		Ok(())
	}
	
	pub fn update(db: &Connection, id: usize, name: &str) -> Result<(), rusqlite::Error> {
		db.prepare("UPDATE categories SET name = @name WHERE id = @id")?
			.execute(named_params! { "@id": id, "@name": name })?;
		Ok(())
	}
	
	pub fn get(db: &Connection, id: usize) -> Result<Category, rusqlite::Error> {
		db.prepare("SELECT * FROM categories WHERE id = @id")?
			.query_row(named_params! { "@id": id }, |r| {
				Ok(Category {
					id: r.get("id").unwrap(),
					name: r.get("name").unwrap(),
				})
			})
	}

    pub fn get_all(db: &Connection) -> Result<Vec<Category>, rusqlite::Error> {
        db.prepare("SELECT * FROM categories")?
            .query_map([], |r| {
                Ok(Category {
                    id: r.get("id").unwrap(),
                    name: r.get("name").unwrap(),
                })
            })
            .unwrap()
            .collect()
    }
}
