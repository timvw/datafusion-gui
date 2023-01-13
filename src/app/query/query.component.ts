import {Component, ViewChild} from '@angular/core';
import {QueryResultsComponent} from "../query-results/query-results.component";
import {QueryService} from "../query.service";
import {listen} from "@tauri-apps/api/event";
import {FileDropEvent} from "@tauri-apps/api/window";
import {NgxEditorModel} from "ngx-monaco-editor-v2/lib/types";
import {editor} from "monaco-editor";
import ICodeEditor = editor.ICodeEditor;
import IEditorOptions = editor.IEditorOptions;
//import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {

  //IEditorScrollbarOptions
  editorOptions: IEditorOptions = {
    lineNumbers: 'off',
    minimap: { enabled: false },
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden',
    }
  };
  code: NgxEditorModel= {
    language: 'sql',
    value: 'select  * from dual;' +
      '\nselect * from information_schema.tables;' +
      '\ncreate external table test stored as parquet location \'/Users/timvw/Desktop/test.parquet\';' +
      '\nselect * from test limit 10;'};

  editor!: ICodeEditor;
  onInit(editor: any) {
    this.editor = editor as ICodeEditor;
  }

  @ViewChild('queryResults') queryResults!: QueryResultsComponent;

  constructor(
      private queryService: QueryService,
  ) {
    const unlisten = listen<FileDropEvent>('tauri://file-drop', async event => {
      console.log('handling filedrop ' + event + ' payload: ' + event.payload);
      if(this.editor != null) {
        const existing = this.editor.getModel()?.getValue();
        const updated = existing +
            '\nCREATE EXTERNAL TABLE test STORED AS PARQUET LOCATION \'' + event.payload + '\';' +
            '\nSELECT * FROM test LIMIT 10;';
        this.editor.getModel()?.setValue(updated);
      }
    });
  }



  query(sql: string): void {
    console.log("querying for: " + sql);
    this.queryService.execute(sql).then((data) => {
      this.queryResults.updateData(data);
    }).catch(error => console.log(error));
  }

  onSubmit() {
    if(this.editor != null) {
      const model = this.editor.getModel();
      if(model != null){
        // @ts-ignore
        const selectedText = model.getValueInRange(this.editor.getSelection());
        if (selectedText != '') {
          this.query(selectedText);
        } else {
          this.query(model.getValue());
        }
      }
    }
  }
}
