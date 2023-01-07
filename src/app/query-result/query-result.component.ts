import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {QueryResult} from "../models/query-result";

@Component({
  selector: 'app-query-result',
  templateUrl: './query-result.component.html',
  styleUrls: ['./query-result.component.css']
})
export class QueryResultComponent implements OnInit {

  constructor() {
  }

  @ViewChild('table') table!: MatTable<any>;

  dataSource = new MatTableDataSource<any>();

  columns: Array<any> = [];
  displayedColumns:Array<any> = [];

  ngOnInit(): void {
  }

  updateData(queryResults: QueryResult[]): void {
    const queryResult = queryResults[0];
    this.dataSource.data = queryResult.data;
    this.columns = queryResult.columns.map(column => {
      return {
        columnDef: column.name,
        header: column.name,
        cell: (element: any) => `${element[column.name] ? element[column.name] : ``}`
      }
    })
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.table.renderRows();
  }

}
