import {QueryResultColumn} from "./query-result-column";

export interface QueryResult {
    query: string,
    columns: Array<QueryResultColumn>
    data: Object[],

    message: string,
}
