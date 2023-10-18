use std::sync::{Arc, Mutex};

use rusqlite::Connection;

use crate::searcher::Searcher;

pub struct AppState {
    pub db: Mutex<Option<rusqlite::Connection>>,
    pub searcher: Arc<Mutex<Searcher>>,
}

pub trait ServiceAccess {
    fn db_map<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&Connection) -> TResult;
    fn db_mut_map<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&mut Connection) -> TResult;
}

impl ServiceAccess for AppState {
    fn db_map<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&Connection) -> TResult,
    {
        let db_connection_guard = self.db.lock().unwrap();
        let db = db_connection_guard.as_ref().unwrap();
        operation(db)
    }

    fn db_mut_map<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&mut Connection) -> TResult,
    {
        let mut db_connection_guard = self.db.lock().unwrap();
        let db = db_connection_guard.as_mut().unwrap();
        operation(db)
    }
}
