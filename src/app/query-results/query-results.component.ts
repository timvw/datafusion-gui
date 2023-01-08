import { Component } from '@angular/core';
import {QueryResult} from "../models/query-result";
import {MatTableDataSource} from "@angular/material/table";
import {QueryResultComponent} from "../query-result/query-result.component";

@Component({
  selector: 'app-query-results',
  templateUrl: './query-results.component.html',
  styleUrls: ['./query-results.component.css']
})
export class QueryResultsComponent {

  queryResults: QueryResult[] = [];

  updateData(queryResults: QueryResult[]): void {
    /*this.queryResults = queryResults.map(qr => {
      var mds = new MatTableDataSource<any>();
      mds.data = qr.data;
      return mds;
    });*/
    this.queryResults = queryResults;
  }
}
