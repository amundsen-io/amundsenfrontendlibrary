import axios, { AxiosResponse } from 'axios';

import AppConfig from 'config/config';
import { ResourceType, SearchAllOptions } from 'interfaces';

import { DashboardSearchResults, TableSearchResults, UserSearchResults } from '../types';

const BASE_URL = '/api/search/v0';

interface SearchAPI {
  msg: string;
  status_code: number;
  search_term: string;
  dashboards?: DashboardSearchResults;
  tables?: TableSearchResults;
  users?: UserSearchResults;
};

export function searchAll(options: SearchAllOptions, term: string) {
  const searchAllResponse = {
    search_term: term,
    tables: undefined,
    users: undefined,
  };

  const requests = [
    axios.get(`${BASE_URL}/table?query=${term}&page_index=${options.tableIndex || 0}`)
      .then((tableResponse: AxiosResponse<SearchAPI>) => {
        searchAllResponse.tables = tableResponse.data.tables;
      })
  ];
  if (AppConfig.indexUsers.enabled) {
    requests.push(
      axios.get(`${BASE_URL}/user?query=${term}&page_index=${options.userIndex || 0}`)
        .then((userResponse: AxiosResponse<SearchAPI>) => {
          searchAllResponse.users = userResponse.data.users;
        })
    )
  }

  return axios.all(requests).then(() => {
    return searchAllResponse
  });
};

export function searchResource(pageIndex: number, resource: ResourceType, term: string) {
  return axios.get(`${BASE_URL}/${resource}?query=${term}&page_index=${pageIndex}`)
    .then((response: AxiosResponse<SearchAPI>) => {
      const { data } = response;
      const ret = { searchTerm: data.search_term };
      ['tables', 'users'].forEach((key) => {
        if (data[key]) {
          ret[key] = data[key];
        }
      });
      return ret;
    });
};
