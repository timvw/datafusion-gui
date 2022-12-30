#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Arc;
use datafusion::arrow::error::ArrowError;
use datafusion::error::DataFusionError;
use datafusion::prelude::*;
use serde_json::{Map, Value};

fn dfe_to_s(e: DataFusionError) -> String {
    format!("df error: {:?}", e)
}

fn ae_to_s(e: ArrowError) -> String {
    format!("ae error: {:?}", e)
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn greet(name: &str, state: tauri::State<'_, Arc<SessionContext>>) -> Result<Vec<Map<String, Value>>, String> {
    let df = state.sql(name).await.map_err(dfe_to_s)?;
    let results = df.collect().await.map_err(dfe_to_s)?;
    let value = datafusion::arrow::json::writer::record_batches_to_json_rows(&results).map_err(ae_to_s)?;
    Ok(value)
}

fn main() {

    let config = SessionConfig::new().with_information_schema(true);
    let ctx = SessionContext::with_config(config);

    tauri::Builder::default()
        .manage(Arc::new(ctx))
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
