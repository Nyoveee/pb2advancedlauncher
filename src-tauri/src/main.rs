#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;
use std::io::Cursor;
use notify::{Config, Watcher, RecommendedWatcher, RecursiveMode};
use directories::BaseDirs;
use std::thread;
use tauri::{Manager};
use tauri::api::process::Command;

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

fn main() {
    tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_filesize, download_game, launch_game])
    .setup(|app|{
        //handle to pass it to the newly spawn thread
        let handle = app.handle();

        //spawn a thread to handle watching for filesystem changes in the mod folder. new thread so that it doesnt block the main thread (app from freezing).
        thread::spawn(move ||{
            //get the mod folder directory for monitoring
            let basedirs = BaseDirs::new().unwrap();
            let mod_dir = basedirs.config_dir().join("nyove.pb2modlauncher").join("mod");
        
            println!("Watching directory: {}", mod_dir.display());
        
            //sets up watcher
            let (tx, rx) = std::sync::mpsc::channel();
        
            //Automatically select the best implementation for your platform.
            let mut watcher = RecommendedWatcher::new(tx, Config::default()).unwrap();
        
            // Add a path to be watched. All files and directories at that path and below will be monitored for changes.
            watcher.watch(&mod_dir, RecursiveMode::Recursive).unwrap();
        
            //continues loop through the receive channel to find fs changes
            for res in rx {
                match res {
                    Ok(event) => {
                        match event.kind {
                            notify::EventKind::Create(_) => handle.emit_all("mod_fs_change", Payload { message: "create".into() }).unwrap(),
                            notify::EventKind::Remove(_) => handle.emit_all("mod_fs_change", Payload { message: "remove".into() }).unwrap(),
                            notify::EventKind::Modify(_) => handle.emit_all("mod_fs_change", Payload { message: "remove".into() }).unwrap(),
                            _ => (),
                        }
                    }
                    Err(e) => println!("Error occured while watching for filesystem changes in mod folder: {:?}", e),
                }
            }
        });
        Ok(())
    })
    .on_window_event(|event| match event.event() {
        tauri::WindowEvent::Destroyed => {
            println!{"Process exiting.."}
            //exit using this method so sidecar persist
            std::process::exit(0)
        }
        _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn launch_game(params: String) {
    println!("{}", params);
    let arg = [params];

    Command::new_sidecar("flashplayer")
    .expect("failed to create `flashplayer` binary command")
    .args(arg)
    .spawn()
    .expect("Failed to spawn sidecar");
}

#[tauri::command]
async fn get_filesize(filepath: String) -> u64 {
    let metadata = fs::metadata(&filepath).expect(&format!("Invalid file path: {}", &filepath));
    metadata.len()
}

#[tauri::command]
async fn download_game(filepath: String) -> Result<String, String>{
    match download_game_handler(filepath).await{
        Ok(_) => Ok("success".to_string()),
        Err(err) => Err(format!("{}", err))
    }
}

async fn download_game_handler(filepath: String) -> Result<(), Box<dyn std::error::Error>>{
    let url = "https://www.plazmaburst2.com/pb2/pb2_re34.swf";
    let response = reqwest::get(url).await?;

    let mut file = std::fs::File::create(filepath)?;
    let mut content = Cursor::new(response.bytes().await.expect("Couldn't retrieve binary content of HTTP response."));
    std::io::copy(&mut content, &mut file)?;

    Ok(())
}