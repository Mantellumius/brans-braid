const INVALID_DIRS: [&str; 10] = [
    ".git",
    "venv",
    ".idea",
    "dist",
    "build",
    "target",
    "node_modules",
    "Library",
    "Debug",
    "postgres",
];

pub fn is_valid_filename(filename: &str) -> bool {
    !INVALID_DIRS.iter().any(|&dir| filename == dir)
}

pub fn get_file_name(entry: &jwalk::DirEntry<((), ())>) -> &str {
    entry.file_name().to_str().unwrap_or_default()
}
