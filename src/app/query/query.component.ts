import {Component, ElementRef, ViewChild} from '@angular/core';
import {QueryResultsComponent} from "../query-results/query-results.component";
import {QueryService} from "../query.service";
import {FormBuilder} from "@angular/forms";
import {listen} from "@tauri-apps/api/event";
import {FileDropEvent} from "@tauri-apps/api/window";

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  queryForm = this.formBuilder.group({
    query: 'select * from information_schema.tables;\n' +
        'create external table test stored as parquet location \'/Users/timvw/Desktop/test.parquet\';\n' +
        'select * from test limit 10;',
  });

  private selectedText: string = '';

  @ViewChild('queryResults') queryResults!: QueryResultsComponent;
  @ViewChild('q') $textarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
      private queryService: QueryService,
      private formBuilder: FormBuilder,
  ) {
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
    this.queryService.execute(sql).then((data) => {
      this.queryResults.updateData(data);
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
