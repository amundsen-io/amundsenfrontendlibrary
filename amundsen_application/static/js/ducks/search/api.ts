import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  DashboardSearchResults,
  TableSearchResults,
  UserSearchResults,
} from './types';

import { SearchReducerState } from "./reducer";

interface SearchResponse {
  msg: string;
  status_code: number;
  search_term: string;
  dashboard: DashboardSearchResults;
  table: TableSearchResults;
  user: UserSearchResults;
}

function transformSearchResults(data: SearchResponse): SearchReducerState {
  return {
    searchTerm: data.search_term,
    dashboard: data.dashboard,
    table: data.table,
    user: data.user,
  };
}

export function searchExecuteSearch(action) {
  const { term, pageIndex } = action;
  return axios.get(`/api/search/v0/?query=${term}&page_index=${pageIndex}`)
  .then((response: AxiosResponse<SearchResponse>)=> transformSearchResults(response.data))
  .catch((error: AxiosError) => transformSearchResults(error.response.data));
}
