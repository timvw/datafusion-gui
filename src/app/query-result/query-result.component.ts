import {Component, Input, OnInit, ViewChild} from '@angular/core';
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

  @Input() queryResult!: QueryResult;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  columns: Array<any> = [];
  displayedColumns:Array<any> = [];

  ngOnInit(): void {
    this.updateData(this.queryResult);
  }

  updateData(queryResult: QueryResult): void {
    this.columns = queryResult.columns.map(column => {
      return {
        columnDef: column.name,
        header: column.name,
        cell: (element: any) => `${element[column.name] ? element[column.name] : ``}`
      }
    })
    this.displayedColumns = this.columns.map(c => c.columnDef);
    //this.table.renderRows();
    this.dataSource.data = queryResult.data;
  }

}
