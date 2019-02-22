export enum SearchResultType {
  table = "table",
  user = "user",
  dashboard = "dashboard",
}

export interface SearchResult {
  type: SearchResultType;
}

export interface TableSearchResult extends SearchResult {
  type: SearchResultType.table;
  database: string;
  cluster: string;
  description: string;
  key: string;
  last_updated: number;
  name: string;
  schema_name: string;
}

// Placeholder until the schema is defined.
export interface UserSearchResult extends SearchResult  {
  type: SearchResultType.user;
  first_name: string;
  last_name: string;
  email: string;
}

// Placeholder until the schema is defined.
export interface DashboardSearchResult extends SearchResult  {
  type: SearchResultType.dashboard;
  title: string;
}

interface SearchResults<T> {
  page_index: number;
  total_results: number;
  results: T[];
}

export type DashboardSearchResults = SearchResults<DashboardSearchResult>;
export type TableSearchResults = SearchResults<TableSearchResult>;
export type UserSearchResults = SearchResults<UserSearchResult>;
