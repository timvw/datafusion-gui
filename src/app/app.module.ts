import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from "@angular/platform-browser";
import {MatTableModule} from "@angular/material/table";
import {CdkTableModule} from "@angular/cdk/table";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { QueryResultComponent } from './query-result/query-result.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';

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
  {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    ...environment.providers,
  ],
  exports: [
    QueryResultComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
