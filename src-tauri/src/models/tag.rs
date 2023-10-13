use rusqlite::{named_params, Connection};

#[derive(serde::Serialize)]
pub struct Tag {
    pub id: usize,
    pub name: String,
    pub category_id: usize,
}

impl Tag {
    pub fn create(db: &Connection, name: &str, category_id: usize) -> Result<(), rusqlite::Error> {
        db.prepare("INSERT INTO categories (name, category_id) VALUES (@name, @category_id)")?
            .execute(named_params! { "@name": name, "@category_id": category_id })?;
        Ok(())
    }

    pub fn delete(db: &Connection, id: usize) -> Result<(), rusqlite::Error> {
        db.prepare("DELETE FROM categories WHERE id = @id")?
            .execute(named_params! { "@id": id })?;
        Ok(())
    }

    pub fn update(
        db: &Connection,
        id: usize,
        name: &str,
        category_id: usize,
    ) -> Result<(), rusqlite::Error> {
        db.prepare(
            "UPDATE categories SET name = @name, category_id = @category_id WHERE id = @id",
        )?
        .execute(named_params! { "@id": id, "@name": name, "@category_id": category_id })?;
        Ok(())
    }

    pub fn get(db: &Connection, id: usize) -> Result<Tag, rusqlite::Error> {
        db.prepare("SELECT * FROM categories WHERE id = @id")?
            .query_row(named_params! { "@id": id }, |r| {
                Ok(Tag {
                    id: r.get("id").unwrap(),
                    name: r.get("name").unwrap(),
                    category_id: r.get("category_id").unwrap(),
                })
            })
    }

    pub fn get_all(db: &Connection) -> Result<Vec<Tag>, rusqlite::Error> {
        db.prepare("SELECT * FROM categories")?
            .query_map([], |r| {
                Ok(Tag {
                    id: r.get("id").unwrap(),
                    name: r.get("name").unwrap(),
					category_id: r.get("category_id").unwrap(),
                })
            })
            .unwrap()
            .collect()
    }
}
