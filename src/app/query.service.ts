import { Injectable } from '@angular/core';
import {invoke} from "@tauri-apps/api/tauri";

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  execute(sql: String): Promise<Object[]> {
    return invoke<Object[]>("greet", { name: sql });
  }
}
