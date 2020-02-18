import { User } from 'interfaces/User';
import { Tag } from 'interfaces/Tags';
import { TableReader, TableSummary } from 'interfaces/TableMetadata';

export interface Dashboard {
  uri: string;
  cluster: string;
  group_name: string;
  group_url: string;
  name: string;
  url: string;
  description: string;
  created_timestamp: number;
  updated_timestamp: number;
  last_run_timestamp: number;
  last_run_state: string;
  owners: User[];
  frequent_users: TableReader[];
  chart_names: string[];
  query_names: string[];
  tables: TableSummary[];
  tags: Tag[];
}
