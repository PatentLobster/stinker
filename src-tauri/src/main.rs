#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::api::shell;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use tauri_plugin_sql::{Migration, MigrationKind, TauriSql};

fn main() {
  let ctx = tauri::generate_context!();
  let about_menu = Submenu::new("App", Menu::new()
      .add_native_item(MenuItem::Hide)
      .add_native_item(MenuItem::HideOthers)
      .add_native_item(MenuItem::ShowAll)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Quit));

  let edit_menu = Submenu::new("Edit", Menu::new()
      .add_native_item(MenuItem::Undo)
      .add_native_item(MenuItem::Redo)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Cut)
      .add_native_item(MenuItem::Copy)
      .add_native_item(MenuItem::Paste)
      .add_native_item(MenuItem::SelectAll));

  let view_menu = Submenu::new("View", Menu::new()
      .add_native_item(MenuItem::EnterFullScreen));

  let window_menu = Submenu::new("Window", Menu::new()
      .add_native_item(MenuItem::Minimize)
      .add_native_item(MenuItem::Zoom));

  let help_menu = Submenu::new("Help", Menu::new()
      .add_item(CustomMenuItem::new("Learn More", "Learn More")));

  let menu = Menu::new()
      .add_submenu(about_menu)
      .add_submenu(edit_menu)
      .add_submenu(view_menu)
      .add_submenu(window_menu)
      .add_submenu(help_menu);

  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![])
      .menu(menu)
      .plugin(TauriSql::default().add_migrations(
      "sqlite:test.db",
      vec![Migration {
        version: 1,
        description: "create snippets",
        sql: include_str!("../migrations/1.sql"),
        kind: MigrationKind::Up,
      }],
    ))
      .run(ctx)
    .expect("error while running tauri application");
}
