import {Component, ElementRef, ViewChild} from '@angular/core';
import {QueryResultsComponent} from "../query-results/query-results.component";
import {QueryService} from "../query.service";
import {FormBuilder} from "@angular/forms";
import {listen} from "@tauri-apps/api/event";
import {FileDropEvent} from "@tauri-apps/api/window";
import {NgxEditorModel} from "ngx-monaco-editor-v2/lib/types";
import {EditorComponent} from "ngx-monaco-editor-v2";
import {editor} from "monaco-editor";
import ICodeEditor = editor.ICodeEditor;

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {

  editorOptions = {
    theme: 'vs-os',
    lineNumbers: 'off',
    minimap: { enabled: false },
    contextmenu: false,
    autoResize: false,
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden',
    }
  };
  code: NgxEditorModel= {
    language: 'sql',
    value: 'select * from test;\nselect  * from dual;' +
      '\nselect * from information_schema.tables;' +
      '\ncreate external table test stored as parquet location \'/Users/timvw/Desktop/test.parquet\';' +
      '\nselect * from test limit 10;'};

  editor!: ICodeEditor;
  onInit(editor: any) {
    this.editor = editor as ICodeEditor;
    console.log('FOUND editor: ' + editor);
  }

  @ViewChild('queryResults') queryResults!: QueryResultsComponent;

  constructor(
      private queryService: QueryService,
  ) {
    const unlisten = listen<FileDropEvent>('tauri://file-drop', async event => {
      console.log('handling filedrop ' + event + ' payload: ' + event.payload);
      /*
      const existing = this.queryForm.value.query ?? '';
      const sql = existing +
          '\nCREATE EXTERNAL TABLE test STORED AS PARQUET LOCATION \'' + event.payload + '\';' +
          '\nSELECT * FROM test LIMIT 10;';
      console.log('need to update queryform value to ' + sql);
      this.queryForm.patchValue({
        query: sql,
      });*/
    });
  }



  query(sql: string): void {
    console.log("querying for: " + sql);
    this.queryService.execute(sql).then((data) => {
      this.queryResults.updateData(data);
    }).catch(error => console.log(error));
  }

  onSubmit() {
    const e=  this.editor;
    if(e != null) {
      // @ts-ignore
      const selectedText = e.getModel().getValueInRange(this.editor.getSelection());
      if (selectedText != '') {
        this.query(selectedText);
      } else {
        // @ts-ignore
        this.query(e.getModel().getValue());
      }
    }
  }
}
