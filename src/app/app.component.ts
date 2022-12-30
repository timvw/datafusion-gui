import {Component, ViewChild} from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import {QueryResultComponent} from "./query-result/query-result.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  greetingMessage = "";

  @ViewChild("queryResult") queryResult!: QueryResultComponent;

  greet(name: string): void {
    invoke<Object[]>("greet", { name }).then((data) => {
      //this.greetingMessage = text;
      this.queryResult.dataSource = data;
    }).catch((error) => console.error(error));
  }
}
