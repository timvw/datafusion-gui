import {Component, ElementRef, ViewChild} from "@angular/core";
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
    query: 'select * from information_schema.tables;\n' +
           '# Press run and see the current database tables below',
  });

  private selectedText: string = '';

  @ViewChild('queryResult') queryResult!: QueryResultComponent;
  @ViewChild('q') $textarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
      private queryService: QueryService,
      private formBuilder: FormBuilder,
  ) {
    console.log('creating app component');
    const unlisten = listen<FileDropEvent>('tauri://file-drop', async event => {
      console.log('handling filedrop ' + event + ' payload: ' + event.payload);
      const existing = this.queryForm.value.query ?? '';
      const sql = existing +
        '\nCREATE EXTERNAL TABLE test STORED AS PARQUET LOCATION \'' + event.payload + '\';' +
        '\nSELECT * FROM test LIMIT 10;';
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
    const textArea = this.$textarea.nativeElement;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = textArea.value.substr(start, end - start);

    if (selectedText != '') {
      this.query(selectedText);
    } else {
      this.query(this.queryForm.value.query ?? '');
    }
  }
}
