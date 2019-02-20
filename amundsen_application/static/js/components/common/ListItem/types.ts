import { SearchListResult } from '../../SearchPage/types'



export interface QueryParams {
  source: string;
  index: number;
}

export interface TableListItemData {
  type: ListItemType.table;
  data: TableData;
  params: QueryParams;
}


// TODO - use a common definition for table data
export interface TableData {
  cluster: string;
  database: string;
  description: string;
  key: string;
  last_updated: number;
  name: string;
  schema_name: string;
}
