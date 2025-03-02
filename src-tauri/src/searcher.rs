use jwalk::{DirEntryIter, WalkDir};
use std::iter::Flatten;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use crate::models::Item;
use crate::utils::{get_file_name, is_valid_filename};

type FolderIterator = Flatten<DirEntryIter<((), ())>>;

pub struct Searcher {
    call_number: Arc<Mutex<usize>>,
    query: Arc<Mutex<String>>,
    iterator: Arc<Mutex<FolderIterator>>,
}

impl Default for Searcher {
    fn default() -> Self {
        Self {
            call_number: Arc::new(Mutex::new(0)),
            iterator: Arc::new(Mutex::new(Searcher::create_folder_iterator(
                ".",
                1,
            ))),
            query: Arc::new(Mutex::new(String::new())),
        }
    }
}

impl Searcher {
    pub fn get_results(&self) -> Vec<Item> {
        let mut iterator = self.iterator.lock().unwrap();
        let call_number = *self.call_number.lock().unwrap();
        let query = &*self.query.lock().unwrap();
        let mut result = Vec::<Item>::new();
        let interval = Duration::from_secs(1);
        let start = Instant::now();
        for entry in iterator
            .by_ref()
            .take_while(|_| *self.call_number.lock().unwrap() == call_number)
        {
            if get_file_name(&entry).to_lowercase().contains(query) {
                if let Ok(item) = Item::try_from(&entry) {
                    result.push(item);
                }
            }
            if start.elapsed() > interval && !result.is_empty() {
                return result;
            }
        }
        if *self.call_number.lock().unwrap() == call_number {
            result
        } else {
            Vec::<Item>::new()
        }
    }

    pub fn update_folder_iterator(&mut self, path: &str, depth: usize, query: String) -> usize {
        *self.iterator.lock().unwrap() = Searcher::create_folder_iterator(path, depth);
        *self.call_number.lock().unwrap() += 1;
        *self.query.lock().unwrap() = query;
        *self.call_number.lock().unwrap()
    }

    pub fn create_folder_iterator(path: &str, depth: usize) -> FolderIterator {
        WalkDir::new(path)
            .parallelism(jwalk::Parallelism::RayonNewPool(8))
            .min_depth(1)
            .max_depth(depth)
            .process_read_dir(|_, _, _, children| {
                children.iter_mut().flatten().for_each(|dir_entry| {
                    if !is_valid_filename(get_file_name(dir_entry)) {
                        dir_entry.read_children_path = None;
                    }
                });
            })
            .into_iter()
            .flatten()
    }
}
