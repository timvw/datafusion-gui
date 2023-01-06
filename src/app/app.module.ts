import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { QueryResultComponent } from './query-result/query-result.component';
import {BrowserModule} from "@angular/platform-browser";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {CdkTableModule} from "@angular/cdk/table";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
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
    ...environment.providers,
  ],
  exports: [
    QueryResultComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
