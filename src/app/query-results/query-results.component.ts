import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {QueryResult} from "../models/query-result";

@Component({
  selector: 'app-query-results',
  templateUrl: './query-results.component.html',
  styleUrls: ['./query-results.component.css']
})
export class QueryResultsComponent {

  queryResults: QueryResult[] = [];

  updateData(queryResults: QueryResult[]): void {
    this.queryResults = queryResults;
  }
}
