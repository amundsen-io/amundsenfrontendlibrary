import axios, { AxiosError, AxiosResponse } from 'axios';

import { ExecuteSearchRequest, SearchResponse } from '../types';

import { SearchReducerState } from '../reducer';
import { ResourceType } from "../../../components/common/ResourceListItem/types";

// function transformSearchResults(data: SearchResponse): SearchReducerState {
//   return {
//     searchTerm: data.search_term,
//     dashboards: data.dashboards,
//     tables: data.tables,
//     users: data.users,
//   };
// }

export function searchExecuteSearch(action: ExecuteSearchRequest) {
  const { term, pageIndex } = action;
  let baseUrl = '/api/search/v0';
  let params = `?query=${term}&page_index=${pageIndex}`;

  return axios.all([
      axios.get(`${baseUrl}/table${params}`),
      axios.get(`${baseUrl}/user${params}`),
    ]).then(axios.spread((tableResponse: AxiosResponse<SearchResponse>, userResponse: AxiosResponse<SearchResponse>) => {
      return {
        searchTerm: tableResponse.data.search_term,
        tables: tableResponse.data.tables,
        users: userResponse.data.users,
      }
  }));



  // return axios.get(url + params)
  // .then((response: AxiosResponse<SearchResponse>) => transformSearchResults(response.data))
  // .catch((error: AxiosError) => {
  //   const data = error.response ? error.response.data : {};
  //   return transformSearchResults(data);
  // });
}
