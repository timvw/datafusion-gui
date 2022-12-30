import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockQueryService {

  mockData = [
    { table_catalog: 'datafusion', table_schema: 'public', table_name: 'tbl', table_type: 'BASE TABLE'},
    { table_catalog: 'datafusion', table_schema: 'information_schema', table_name: 'tables', table_type: 'VIEW'},
    { table_catalog: 'datafusion', table_schema: 'information_schema', table_name: 'views', table_type: 'VIEW'},
    { table_catalog: 'datafusion', table_schema: 'information_schema', table_name: 'columns', table_type: 'VIEW'},
    { table_catalog: 'datafusion', table_schema: 'information_schema', table_name: 'df_settings', table_type: 'VIEW'},
  ];

  execute(sql: String): Promise<Object[]> {
    return Promise.resolve(this.mockData);
  }
}
