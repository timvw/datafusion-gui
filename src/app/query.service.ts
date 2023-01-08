import { Injectable } from '@angular/core';
import {invoke} from "@tauri-apps/api/tauri";
import {QueryResult} from "./models/query-result";

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  execute(sql: String): Promise<QueryResult[]> {
    return invoke<QueryResult[]>("execute_sql", { sql: sql });
  }
}
