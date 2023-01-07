import {QueryResultColumn} from "./query-result-column";

export interface QueryResult {
    columns: Array<QueryResultColumn>
    data: Object[],
}
