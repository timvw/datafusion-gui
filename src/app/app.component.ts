import {Component, ViewChild} from "@angular/core";
import { FormBuilder } from '@angular/forms';
import {QueryResultComponent} from "./query-result/query-result.component";
import {QueryService} from "./query.service";
import {listen} from "@tauri-apps/api/event";
import {FileDropEvent} from "@tauri-apps/api/window";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {


  queryForm = this.formBuilder.group({
    query: 'SHOW TABLES',
  });

  @ViewChild('queryResult') queryResult!: QueryResultComponent;

  constructor(
      private queryService: QueryService,
      private formBuilder: FormBuilder,
  ) {
    console.log('creating app component');
    const unlisten = listen<FileDropEvent>('tauri://file-drop', async event => {
      console.log('handling filedrop ' + event + ' payload: ' + event.payload);
      const existing = this.queryForm.value.query ?? '';
      const sql = existing + '\nCREATE EXTERNAL TABLE STORED AS PARQUET LOCATION \'' + event.payload + '\'';
      console.log('need to update queryform value to ' + sql);
      this.queryForm.patchValue({
        query: sql,
      });
    });
  }



  query(sql: string): void {
    console.log('need to execute: ' + sql);
    this.queryService.execute(sql).then((data) => {
      console.log('updating child datasource to ' + data);
      this.queryResult.dataSource.data = data;
      this.queryResult.updateData();
    }).catch(error => console.log(error));
  }

  onSubmit() {
    this.query(this.queryForm.value.query ?? '');
  }
}
