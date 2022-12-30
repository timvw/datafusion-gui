import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-query-result',
  templateUrl: './query-result.component.html',
  styleUrls: ['./query-result.component.css']
})
export class QueryResultComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() dataSource: any[] = [];
  columns: Array<any> = [];
  displayedColumns:Array<any> = [];

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('need to handle ' + changes);

    // Get list of columns by gathering unique keys of objects found in DATA.
    const columns = this.dataSource.length == 0 ? [] : Object.getOwnPropertyNames(this.dataSource[0]);

    // Describe the columns for <mat-table>.
    this.columns = columns.map(column => {
      return {
        columnDef: column,
        header: column,
        cell: (element: any) => `${element[column] ? element[column] : ``}`
      }
    })
    this.displayedColumns = this.columns.map(c => c.columnDef);
  }

}
