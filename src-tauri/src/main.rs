#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::api::shell;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
mod db;

fn main() {
  let ctx = tauri::generate_context!();
  println!("format {:?} arguments", db::get_db_path(&ctx));
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

   // tauri::Builder::default()
   //  .run(tauri::generate_context!())
   //  .expect("error while running tauri application");
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![])
      // .create_window("d", WindowUrl::default(), |win, webview| {
      //   let win = win
      //       .title("Tauri Template")
      //       .resizable(true)
      //       .transparent(false)
      //       .decorations(true)
      //       .always_on_top(false)
      //       .inner_size(800.0, 550.0)
      //       .min_inner_size(400.0, 200.0)
      //       .skip_taskbar(false)
      //       .fullscreen(false);
      //   return (win, webview);
      // })
      .menu(menu)
      .on_menu_event(|event| {
        let event_name = event.menu_item_id();
        match event_name {
          "Learn More" => {
            shell::open(
              "https://www.my-app.com".to_string(),
              None,
            )
                .unwrap();
          }
          _ => {}
        }
      })
      .run(ctx)
    .expect("error while running tauri application");
}

//
//     .menu(Menu::with_items([
//       #[cfg(target_os = "macos")]
//       MenuEntry::Submenu(Submenu::new(
//         &ctx.package_info().name,
//         Menu::with_items([
//           MenuItem::About(ctx.package_info().name.clone()).into(),
//           MenuItem::Separator.into(),
//           MenuItem::Services.into(),
//           MenuItem::Separator.into(),
//           MenuItem::Hide.into(),
//           MenuItem::HideOthers.into(),
//           MenuItem::ShowAll.into(),
//           MenuItem::Separator.into(),
//           MenuItem::Quit.into(),
//         ]),
//       )),
//       MenuEntry::Submenu(Submenu::new(
//         "File",
//         Menu::with_items([MenuItem::CloseWindow.into()]),
//       )),
//       MenuEntry::Submenu(Submenu::new(
//         "Edit",
//         Menu::with_items([
//           MenuItem::Undo.into(),
//           MenuItem::Redo.into(),
//           MenuItem::Separator.into(),
//           MenuItem::Cut.into(),
//           MenuItem::Copy.into(),
//           MenuItem::Paste.into(),
//           #[cfg(not(target_os = "macos"))]
//           MenuItem::Separator.into(),
//           MenuItem::SelectAll.into(),
//         ]),
//       )),
//       MenuEntry::Submenu(Submenu::new(
//         "View",
//         Menu::with_items([MenuItem::EnterFullScreen.into()]),
//       )),
//       MenuEntry::Submenu(Submenu::new(
//         "Window",
//         Menu::with_items([MenuItem::Minimize.into(), MenuItem::Zoom.into()]),
//       )),
//       // You should always have a Help menu on macOS because it will automatically
//       // show a menu search field
//       MenuEntry::Submenu(Submenu::new(
//         "Help",
//         Menu::with_items([CustomMenuItem::new("Learn More", "Learn More").into()]),
//       )),
//     ]))
//     .on_menu_event(|event| {
//       let event_name = event.menu_item_id();
//       match event_name {
//         "Learn More" => {
//           shell::open(
//             "https://github.com/probablykasper/tauri-template".to_string(),
//             None,
//           )
//           .unwrap();
//         }
//         _ => {}
//       }
//     })
//     .run(ctx)
//     .expect("error while running tauri application");
// }