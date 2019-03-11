import {
  SearchAll,
  SearchAllRequest,
  SearchAllResponse,
  SearchResource,
  SearchResourceResponse,
  DashboardSearchResults,
  TableSearchResults,
  UserSearchResults, SearchResourceRequest,
} from './types';
import { ResourceType } from "../../components/common/ResourceListItem/types";

export type SearchReducerAction = SearchAllResponse | SearchResourceResponse;

export interface SearchReducerState {
  searchTerm: string;
  dashboards: DashboardSearchResults;
  tables: TableSearchResults;
  users: UserSearchResults;
}

export function searchAll(term: string, pageIndex: number): SearchAllRequest {
  return {
    pageIndex,
    term,
    type: SearchAll.ACTION,
  };
}

export function searchResource(resource: ResourceType, term: string, pageIndex: number): SearchResourceRequest {
  return {
    pageIndex,
    term,
    resource,
    type: SearchResource.ACTION,
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
  let newState = action.payload;
  switch (action.type) {
    // SearchAll will reset all resources with search results or the initial state
    case SearchAll.SUCCESS:
      return {
        searchTerm: newState.searchTerm,
        dashboards: newState.dashboards || initialState.dashboards,
        users: newState.users || initialState.users,
        tables: newState.tables || initialState.tables,
      };
    // SearchResource will set only a single resource and preserves search state for other resources
    case SearchResource.SUCCESS:
      return {
        searchTerm: newState.searchTerm,
        dashboards: newState.dashboards || state.dashboards,
        users: newState.users || state.users,
        tables: newState.tables || state.tables,
      };
    case SearchAll.FAILURE:
    case SearchResource.FAILURE:
      return initialState;
    default:
      return state;
  }
}
