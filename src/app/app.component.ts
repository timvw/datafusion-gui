import {Component, ViewChild} from "@angular/core";
import {QueryResultComponent} from "./query-result/query-result.component";
import {QueryService} from "./query.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  queryService: QueryService;

  @ViewChild('queryResult') queryResult!: QueryResultComponent;

  constructor(queryService: QueryService) {
    this.queryService = queryService;
  }

  query(sql: string): void {
    this.queryService.execute(sql).then((data) => {
      console.log('updating child datasource to ' + data);
      this.queryResult.dataSource.data = data;
      this.queryResult.ngOnInit();
    }).catch(error => console.log(error));
  }
}
