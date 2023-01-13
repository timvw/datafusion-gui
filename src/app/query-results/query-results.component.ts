import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {QueryResult} from "../models/query-result";

@Component({
  selector: 'app-query-results',
  templateUrl: './query-results.component.html',
  styleUrls: ['./query-results.component.css']
})
export class QueryResultsComponent implements AfterViewInit {

  queryResults: QueryResult[] = [];

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.cdr.detach();
  }

  updateData(queryResults: QueryResult[]): void {
    console.log('updating results to ' + queryResults);
    this.queryResults = queryResults;
  }

  trackByName(index: number, queryResult: QueryResult) {
    return queryResult.query;
  }
}
