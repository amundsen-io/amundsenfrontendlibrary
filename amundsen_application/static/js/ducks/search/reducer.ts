import {
  ExecuteSearch,
  ExecuteSearchRequest,
  ExecuteSearchResponse,
  DashboardSearchResults,
  TableSearchResults,
  UserSearchResults,
} from './types';
import { ResourceType } from "../../components/common/ResourceListItem/types";

export type SearchReducerAction = ExecuteSearchRequest | ExecuteSearchResponse;

export interface SearchReducerState {
  searchTerm: string;
  dashboards: DashboardSearchResults;
  tables: TableSearchResults;
  users: UserSearchResults;
}

export function executeSearch(term: string, pageIndex: number): ExecuteSearchRequest  {
  return {
    term,
    pageIndex,
    type: ExecuteSearch.ACTION,
  };
}

const initialState: SearchReducerState = {
  searchTerm: '',
  dashboards: {
    page_index: 0,
    results: [],
    total_results: 0,
  },
  tables: {
    page_index: 0,
    results: [],
    total_results: 0,
  },
  users: {
    page_index: 0,
    results: [],
    total_results: 0,
  },
};

export default function reducer(state: SearchReducerState = initialState, action: SearchReducerAction): SearchReducerState {
  switch (action.type) {
    case ExecuteSearch.SUCCESS:
      let newState = action.payload;
      return {
        searchTerm: newState.searchTerm,
        dashboards: newState.dashboards || initialState.dashboards,
        users: newState.users || initialState.users,
        tables: newState.tables || initialState.tables,
      };
    case ExecuteSearch.FAILURE:
      return initialState;
    default:
      return state;
  }
}
