import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { QueryResultComponent } from './query-result/query-result.component';
import {BrowserModule} from "@angular/platform-browser";
import {MatTableModule} from "@angular/material/table";
import {CdkTableModule} from "@angular/cdk/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import { QueryEditorComponent } from './query-editor/query-editor.component';
import { TauriEvent} from '@tauri-apps/api/event';

@NgModule({
  declarations: [
    AppComponent,
    QueryResultComponent,
    QueryEditorComponent
  ],
    imports: [
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        MatTableModule,
        CdkTableModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatCardModule,
    ],
  providers: [
    ...environment.providers,
  ],
  exports: [
    QueryResultComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
