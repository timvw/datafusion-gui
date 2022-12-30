import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-query-result',
  templateUrl: './query-result.component.html',
  styleUrls: ['./query-result.component.css']
})
export class QueryResultComponent implements OnInit, OnChanges {

  constructor() { }

  @ViewChild('table') table!: MatTable<any>;

  //@Input() data: any[] = [];
  dataSource = new MatTableDataSource<any>();

  columns: Array<any> = [];
  displayedColumns:Array<any> = [];

  ngOnInit(): void {
    console.log("initialized thingie...")
    this.ngOnChanges({ });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('need to handle ' + changes);

    // Get list of columns by gathering unique keys of objects found in DATA.
    const columns = this.dataSource.data.length == 0 ? [] : Object.getOwnPropertyNames(this.dataSource.data[0]);
    console.log('columns found: ' + columns);

    // Describe the columns for <mat-table>.
    this.columns = columns.map(column => {
      return {
        columnDef: column,
        header: column,
        cell: (element: any) => `${element[column] ? element[column] : ``}`
      }
    })
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.table.renderRows();
  }

}
