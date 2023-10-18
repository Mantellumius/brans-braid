use std::{ffi::OsStr, fs, io, path::Path};
use ts_rs::TS;

#[derive(Debug, serde::Serialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
#[serde(rename_all = "camelCase")]
#[derive(Clone)]
pub struct Item {
    pub path: String,
    pub name: String,
    pub is_dir: bool,
    pub is_file: bool,
    pub is_readonly: bool,
    pub extension: String,
}

impl TryFrom<&fs::DirEntry> for Item {
    type Error = std::io::Error;

    fn try_from(dir: &fs::DirEntry) -> Result<Self, Self::Error> {
        Ok(Item {
            path: dir
                .path()
                .to_str()
                .ok_or(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "Failed to get path",
                ))?
                .to_string(),
            name: dir
                .file_name()
                .to_str()
                .ok_or(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "Failed to get name",
                ))?
                .to_string(),
            is_dir: dir.path().is_dir(),
            is_file: dir.path().is_file(),
            is_readonly: dir.metadata()?.permissions().readonly(),
            extension: get_extension(dir),
        })
    }
}

impl TryFrom<&jwalk::DirEntry<((), ())>> for Item {
    type Error = std::io::Error;

    fn try_from(dir: &jwalk::DirEntry<((), ())>) -> Result<Self, Self::Error> {
        Ok(Item {
            path: dir
                .path()
                .to_str()
                .ok_or(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "Failed to get path",
                ))?
                .to_string(),
            name: dir
                .file_name()
                .to_str()
                .ok_or(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "Failed to get name",
                ))?
                .to_string(),
            is_dir: dir.path().is_dir(),
            is_file: dir.path().is_file(),
            is_readonly: dir.metadata()?.permissions().readonly(),
            extension: get_extension_jwalk(dir),
        })
    }
}

impl TryFrom<&Path> for Item {
    type Error = io::Error;

    fn try_from(path: &Path) -> Result<Self, Self::Error> {
        let metadata = fs::metadata(path).unwrap();
        Ok(Item {
            path: path.to_string_lossy().to_string(),
            name: path.file_name().unwrap().to_str().unwrap().to_string(),
            is_dir: metadata.is_dir(),
            is_file: metadata.is_file(),
            is_readonly: metadata.permissions().readonly(),
            extension: String::new(),
        })
    }
}

fn get_extension(dir: &fs::DirEntry) -> String {
    dir.path()
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_string_lossy()
        .to_string()
}

fn get_extension_jwalk(dir: &jwalk::DirEntry<((), ())>) -> String {
    dir.path()
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_string_lossy()
        .to_string()
}
