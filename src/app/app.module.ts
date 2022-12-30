import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { QueryResultComponent } from './query-result/query-result.component';
import {BrowserModule} from "@angular/platform-browser";
import {MatTableModule} from "@angular/material/table";
import {CdkTableModule} from "@angular/cdk/table";

@NgModule({
  declarations: [
    AppComponent,
    QueryResultComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatTableModule,
    CdkTableModule,
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
