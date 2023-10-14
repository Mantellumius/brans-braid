use rusqlite::Connection;
use std::fs;
use tauri::AppHandle;

const CURRENT_DB_VERSION: u32 = 1;

pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("db.sqlite");
    let mut db = Connection::open(sqlite_path).unwrap();
    rusqlite::vtab::array::load_module(&db)?;
    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| row.get(0))?;
    drop(user_pragma);
    upgrade_database_if_needed(&mut db, existing_user_version)?;
    Ok(db)
}

pub fn upgrade_database_if_needed(
    db: &mut Connection,
    existing_version: u32,
) -> Result<(), rusqlite::Error> {
    if existing_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;
        let tx = db.transaction()?;
        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;
        tx.execute_batch(
            "
            CREATE TABLE folders (
                id INTEGER PRIMARY KEY,
                path TEXT NOT NULL
                UNIQUE(path)
            );
            CREATE TABLE tags (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                category_id INTEGER NOT NULL,
                FOREIGN KEY (category_id) REFERENCES categories(id)
                UNIQUE(name)
            );
            CREATE TABLE categories (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
                UNIQUE(name)
            );
            CREATE TABLE folder_tag (
                folder_id INTEGER NOT NULL,
                tag_id INTEGER NOT NULL,
                FOREIGN KEY (folder_id) REFERENCES folders(id),
                FOREIGN KEY (tag_id) REFERENCES tags(id)
                UNIQUE(folder_id, tag_id)
            );
        ",
        )?;
        tx.commit()?;
    }
    Ok(())
}
