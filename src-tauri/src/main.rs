#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Arc;
use datafusion::arrow::error::ArrowError;
use datafusion::error::DataFusionError;
use datafusion::prelude::*;
use datafusion::sql::parser::{CreateExternalTable, DFParser, Statement};
use serde::{Serialize, Deserialize};
use serde_json::{Map, Value};

fn dfe_to_s(e: DataFusionError) -> String {
    format!("df error: {:?}", e)
}

fn ae_to_s(e: ArrowError) -> String {
    format!("ae error: {:?}", e)
}

#[derive(Serialize, Deserialize)]
pub struct QueryResultColumn {
    pub name: String,
}

#[derive(Serialize, Deserialize)]
pub struct QueryResult {
    pub query: String,
    pub columns: Vec<QueryResultColumn>,
    pub data: Vec<Map<String, Value>>,
    pub message: String,
}

fn get_sql(s: &Statement) -> String {
    match s {
        Statement::Statement(stmt) => format!("{stmt}"),
        Statement::CreateExternalTable(stmt) => get_create_external_table_sql(stmt),
        Statement::DescribeTable(stmt) => format!("DESCRIBE TABLE {}", stmt.table_name),
    }
}

fn get_create_external_table_sql(stmt: &CreateExternalTable) -> String {
    let stmt = format!("{stmt}");
    let loc_pos = stmt.find("LOCATION").unwrap();
    let (first, last) = stmt.split_at(loc_pos + 9);
    format!("{first}'{}'", last.trim_end())
}

#[test]
fn test_get_create_external_table_sql() {
    let cet = CreateExternalTable {
        name: "test".to_string(),
        columns: vec![],
        file_type: "PARQUET".to_string(),
        has_header: false,
        delimiter: ' ',
        location: "/Users/timvw/Desktop/test.parquet".to_string(),
        table_partition_cols: vec![],
        if_not_exists: false,
        file_compression_type: "".to_string(),
        options: Default::default(),
    };
    assert_eq!(get_create_external_table_sql(&cet), "CREATE EXTERNAL TABLE test STORED AS PARQUET LOCATION '/Users/timvw/Desktop/test.parquet'");
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn execute_sql(sql: &str, state: tauri::State<'_, Arc<SessionContext>>) -> Result<Vec<QueryResult>, String> {

    let statements = DFParser::parse_sql(sql).map_err(|pe| format!("{}", pe))?;

    let sql_statements = if statements.len() == 1 {
        vec![String::from(sql)]
    } else {
        statements.iter().map(|s| get_sql(s)).collect()
    };

    let mut query_results = Vec::new();
    for sql in sql_statements {
        let dfr = state.sql(&sql).await.map_err(dfe_to_s);
        let query_result = match dfr {
            Ok(df) => {
                let resultsr = df.collect().await.map_err(dfe_to_s);
                match resultsr {
                    Ok(results) => {
                        let datar = datafusion::arrow::json::writer::record_batches_to_json_rows(&results).map_err(ae_to_s);
                        match datar {
                            Ok(data) => {
                                let columns = df.schema().fields().iter().map(|x| QueryResultColumn { name: String::from(x.name())}).collect();
                                let message = format!("{} rows in set.", data.len());
                                QueryResult {
                                    query: String::from(sql),
                                    columns,
                                    data,
                                    message,
                                }
                            },
                            Err(e) => {
                                QueryResult {
                                    query: String::from(sql),
                                    columns: vec![],
                                    data: vec![],
                                    message: format!{"Error: {e}"},
                                }
                            }
                        }
                    },
                    Err(e) => {
                        QueryResult {
                            query: String::from(sql),
                            columns: vec![],
                            data: vec![],
                            message: format!{"Error: {e}"},
                        }
                    }
                }
            }
            Err(e) => {
                QueryResult {
                    query: String::from(sql),
                    columns: vec![],
                    data: vec![],
                    message: format!{"Error: {e}"},
                }
            }
        };
        query_results.push(query_result);
    };

    Ok(query_results)
}

fn main() {

    let config = SessionConfig::new().with_information_schema(true);
    let ctx = SessionContext::with_config(config);

    tauri::Builder::default()
        .manage(Arc::new(ctx))
        .invoke_handler(tauri::generate_handler![execute_sql])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
