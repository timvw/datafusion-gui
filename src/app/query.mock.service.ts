import { Injectable } from '@angular/core';
import {QueryResult} from "./models/query-result";

@Injectable({
  providedIn: 'root'
})
export class MockQueryService {

  mockShowTables(): QueryResult {
    return {
      is_error: false,
      query: 'select * from information_schema.tables',
      columns: [
        { name: 'table_catalog' },
        { name: 'table_schema' },
        { name: 'table_name' },
        { name: 'table_type' },
      ],
      data: [
        { table_catalog: 'datafusion', table_schema: 'public', table_name: 'tbl', table_type: 'BASE TABLE'},
        { table_catalog: 'datafusion', table_schema: 'information_schema', table_name: 'tables', table_type: 'VIEW'},
        { table_catalog: 'datafusion', table_schema: 'information_schema', table_name: 'views', table_type: 'VIEW'},
        { table_catalog: 'datafusion', table_schema: 'information_schema', table_name: 'columns', table_type: 'VIEW'},
        { table_catalog: 'datafusion', table_schema: 'information_schema', table_name: 'df_settings', table_type: 'VIEW'},
      ],
      message: '4 rows in set.',
    };
  }

  mockSelectTest(): QueryResult {
    return {
      is_error: false,
      query: 'select * from test limit 10',
      columns: [
        {name: 'country'},
        {name: 'city'},
      ],
      data: [
        {country: 'Belgium', city: 'Brussel'},
        {country: 'Belgium', city: 'Leuven'},
        {country: 'Germany', city: 'Berlin'},
      ],
      message: '3 rows in set.',
    };
  }

  mockCreateTable(): QueryResult {
    return {
      is_error: false,
      query: 'create external table test stored as parquet location \'/Users/timvw/Desktop/test.parquet\'',
      columns: [],
      data: [],
      message: '0 rows in set.',
    };
  }

  execute(sql: String): Promise<QueryResult[]> {
    if (sql.toLowerCase().trim() == "select * from information_schema.tables;") {
      return Promise.resolve([this.mockShowTables()]);
    } else if (sql.toLowerCase().trim() == "select * from test limit 10;") {
      return Promise.resolve([this.mockSelectTest()]);
    } else if (sql.toLowerCase().trim() == "create external table test stored as parquet location '/users/timvw/desktop/test.parquet';") {
      return Promise.resolve([this.mockCreateTable()]);
    }
    else {
      const result = [
          this.mockShowTables(),
          this.mockCreateTable(),
          this.mockSelectTest(),
      ]
      return Promise.resolve(result);
    }
  }
}
