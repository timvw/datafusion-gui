#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::future::Future;
use std::sync::Arc;
use datafusion::arrow::error::ArrowError;
use datafusion::arrow::record_batch::RecordBatch;
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
    pub is_error: bool,
    pub message: String,
}

fn rbs_to_json_data(rbs: &Vec<RecordBatch>) -> Result<Vec<Map<String, Value>>, String> {
    datafusion::arrow::json::writer::record_batches_to_json_rows(rbs.as_slice())
        .map_err(ae_to_s)
}

fn query_result_columns_from(df: Arc<DataFrame>) -> Vec<QueryResultColumn> {
    df
        .schema()
        .fields()
        .iter()
        .map(|x| QueryResultColumn { name: String::from(x.name())})
        .collect()
}

fn get_value<T>(result: Result<T, T>) -> T {
    match result {
        Ok(t) => t,
        Err(t) => t,
    }
}

async fn get_future_value<T>(result: Result<impl Future<Output=T>, T>) -> T {
    match result {
        Ok(tf) => tf.await,
        Err(t) => t,
    }
}

impl QueryResult {

    pub async fn from_data(query: &str, df: Arc<DataFrame>) -> QueryResult {

        let result = df.collect().await
            .map_err(dfe_to_s).map_err(|msg| QueryResult::from_error_message(&query, &msg))
            .and_then(|rbs| rbs_to_json_data(&rbs).map_err(|msg|QueryResult::from_error_message(&query, &msg)))
            .and_then(|data| {
                let columns = query_result_columns_from(df);
                let message = format!("{} rows in set.", data.len());
                Ok(QueryResult {
                    is_error: false,
                    query: query.to_string(),
                    columns,
                    data,
                    message,
                })
            });

        get_value(result)
    }

    pub fn from_error_message(query: &str, message: &str) -> QueryResult {
        QueryResult {
            is_error: true,
            query: String::from(query),
            columns: vec![],
            data: vec![],
            message: String::from(message),
        }
    }
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
// need to wrap the returned value ina  result when dealing with state
//https://github.com/tauri-apps/tauri/discussions/4317
#[tauri::command]
async fn execute_sql(sql: String, state: tauri::State<'_, Arc<SessionContext>>) -> Result<Vec<QueryResult>, ()> {
    let parse_result = DFParser::parse_sql(&sql).map_err(|pe| format!("{}", pe));
    let result = match parse_result {
        Err(msg) => vec![QueryResult::from_error_message(&sql, &msg)],
        Ok(statements) => {
            let sql_statements = if statements.len() == 1 {
                vec![String::from(sql)]
            } else {
                statements.iter().map(|s| get_sql(s)).collect()
            };

            let mut query_results = Vec::new();
            for statement in sql_statements {
                let dfr = state.sql(&statement).await
                    .map_err(dfe_to_s).map_err(|msg|QueryResult::from_error_message(&statement, &msg))
                    .and_then(|df| Ok(QueryResult::from_data(&statement, df)));
                let query_result = get_future_value(dfr).await;
                query_results.push(query_result);
            };
            query_results
        }
    };
    Ok(result)
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
