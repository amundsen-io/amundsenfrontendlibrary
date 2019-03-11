import axios, { AxiosError, AxiosResponse } from 'axios';

import { SearchAllRequest, SearchResponse, SearchResourceRequest } from '../types';

export function searchAll(action: SearchAllRequest) {
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
  })).catch((error: AxiosError) => {

  });

  // return axios.get(url + params)
  // .then((response: AxiosResponse<SearchResponse>) => transformSearchResults(response.data))
  // .catch((error: AxiosError) => {
  //   const data = error.response ? error.response.data : {};
  //   return transformSearchResults(data);
  // });
}


export function searchResource(action: SearchResourceRequest) {
  const { term, pageIndex, resource } = action;
  return axios.get(`/api/search/v0/${resource}?query=${term}&page_index=${pageIndex}`)
    .then((response: AxiosResponse) => {
      const { data } = response;
      return {
        searchTerm: data.search_term,
        tables: data.tables,
        users: data.users,
      }
    }).catch((error: AxiosError) => {

    });
}
