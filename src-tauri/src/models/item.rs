use std::{ffi::OsStr, fs};
use ts_rs::TS;

#[derive(Debug, serde::Serialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
#[serde(rename_all = "camelCase")]
pub struct Item {
    pub path: String,
    pub name: String,
    pub is_dir: bool,
    pub is_file: bool,
    pub have_access: bool,
    pub extension: String,
}

impl Item {
    pub fn from(dir: &fs::DirEntry) -> Self {
        Item {
            path: dir.path().to_str().unwrap().to_string(),
            name: dir.file_name().to_str().unwrap().to_string(),
            is_dir: dir.path().is_dir(),
            is_file: dir.path().is_file(),
            have_access: dir.metadata().unwrap().permissions().readonly(),
            extension: get_extension(dir),
        }
    }

	pub fn from_jwalk(dir: &jwalk::DirEntry<((), ())>) -> Self {
		Item {
			path: dir.path().to_str().unwrap().to_string(),
			name: dir.file_name().to_str().unwrap().to_string(),
			is_dir: dir.path().is_dir(),
			is_file: dir.path().is_file(),
			have_access: dir.metadata().unwrap().permissions().readonly(),
			extension: get_extension_jwalk(dir),
		}
	}
}

impl Clone for Item {
    fn clone(&self) -> Self {
        Self {
            path: self.path.clone(),
            name: self.name.clone(),
            is_dir: self.is_dir,
            is_file: self.is_file,
            have_access: self.have_access,
            extension: self.extension.clone(),
        }
    }
}

fn get_extension(dir: &fs::DirEntry) -> String {
    if dir.file_type().unwrap().is_dir() {
        return String::new();
    }
    dir.path()
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_string_lossy()
        .to_string()
}

fn get_extension_jwalk(dir: &jwalk::DirEntry<((), ())>) -> String {
    if dir.file_type().is_dir() {
        return String::new();
    }
    dir.path()
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_string_lossy()
        .to_string()
}
