import {Component, ViewChild} from "@angular/core";
import { FormBuilder } from '@angular/forms';
import {QueryResultComponent} from "./query-result/query-result.component";
import {QueryService} from "./query.service";
import {listen} from "@tauri-apps/api/event";
import {FileDropEvent} from "@tauri-apps/api/window";
import { writeText, readText } from "@tauri-apps/api/clipboard";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {


  queryForm = this.formBuilder.group({
    query: 'SHOW TABLES',
  });

  private selectedText: string = '';

  @ViewChild('queryResult') queryResult!: QueryResultComponent;
  @ViewChild('q') q!: HTMLTextAreaElement;

  constructor(
      private queryService: QueryService,
      private formBuilder: FormBuilder,
  ) {
    console.log('creating app component');
    const unlisten = listen<FileDropEvent>('tauri://file-drop', async event => {
      console.log('handling filedrop ' + event + ' payload: ' + event.payload);
      const existing = this.queryForm.value.query ?? '';
      const sql = existing + '\nCREATE EXTERNAL TABLE test STORED AS PARQUET LOCATION \'' + event.payload + '\'';
      console.log('need to update queryform value to ' + sql);
      this.queryForm.patchValue({
        query: sql,
      });
    });
  }



  query(sql: string): void {
    console.log('need to execute: ' + sql);
    this.queryService.execute(sql).then((data) => {
      this.queryResult.updateData(data);
    }).catch(error => console.log(error));
  }

  onSubmit() {
    if (this.selectedText != '') {
      this.query(this.selectedText);
    } else {
      this.query(this.queryForm.value.query ?? '');
    }
  }

  select(event: any) {
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    this.selectedText = event.target.value.substr(start, end - start);
  }
}
