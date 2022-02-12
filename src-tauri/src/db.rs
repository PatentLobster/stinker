use tauri::api::path::{
    resolve_path,
    BaseDirectory
};

use tauri::utils::assets::EmbeddedAssets;
use tauri::{Context};
use std::path::PathBuf;
// use ejdb::Database;
// use ejdb::DatabaseOpenMode;
pub fn get_db_path(context: &Context<EmbeddedAssets>) -> PathBuf {
  let states_path = resolve_path(
      context.config(),
      context.package_info(),
      ".stinker",
      Some(BaseDirectory::Home),
  )
      .unwrap();
    let db_file_path = states_path.join("stinker.db");

    db_file_path
}

// pub fn get_db(context: &Context<EmbeddedAssets>) {
//     let path = get_db_path(context);
//     let db = Database::open(path);
//
//     db
// }