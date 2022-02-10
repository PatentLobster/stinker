use tauri::api::path::{
    resolve_path,
    BaseDirectory
};

use tauri::utils::assets::EmbeddedAssets;
use tauri::{Context};
use std::path::PathBuf;

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