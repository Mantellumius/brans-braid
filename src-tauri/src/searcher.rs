// use crate::item;
// use jwalk::WalkDir;
// use std::path::PathBuf;

// const INVALID_DIRS: [&str; 7] = [
//     ".git",
//     "venv",
//     ".idea",
//     "node_modules",
//     "Library",
//     "Debug",
//     "postgres",
// ];

// pub struct Searcher {
//     pub query: String,
// }

// impl Searcher {
//     pub fn new() -> Self {
//         Searcher {
//             query: String::new(),
//         }
//     }

//     pub fn search(
//         self,
//         path: PathBuf,
//         filter: impl Fn(&str) -> bool,
//     ) -> impl Iterator<Item = item::Item> {
//         WalkDir::new(path)
//             .process_read_dir(|_, _, _, children| {
//                 children.iter_mut().flatten().for_each(|dir_entry| {
//                     if !Searcher::is_valid_filename(Searcher::get_file_name(dir_entry)) {
//                         dir_entry.read_children_path = None;
//                     }
//                 });
//             })
//             .into_iter()
//             .flatten()
//             .filter(move |entry| filter(Searcher::get_file_name(entry)))
//             .map(|entry| item::Item::from_jwalk(&entry))
//     }

//     pub fn create_filter(query: String, case_sensitive: bool) -> impl Fn(&str) -> bool {
//         let mut local_query = query.clone();
//         if !case_sensitive {
//             local_query = local_query.to_lowercase();
//         }
//         move |file_name: &str| file_name.to_lowercase().contains(&local_query)
//     }

//     fn is_valid_filename(filename: &str) -> bool {
//         !INVALID_DIRS.iter().any(|&dir| filename == dir)
//     }

//     fn get_file_name(entry: &jwalk::DirEntry<((), ())>) -> &str {
//         entry.file_name().to_str().unwrap()
//     }
// }
