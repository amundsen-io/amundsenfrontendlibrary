import { AxiosResponse } from 'axios';
import axiosInstance from 'axiosInstance/instance';
import { TableResource } from 'interfaces';

export type PopularTablesAPI = {
  msg: string;
  results: TableResource[];
}

export function getPopularTables() {
  return axiosInstance.get('/amundsen/api/metadata/v0/popular_tables')
  .then((response: AxiosResponse<PopularTablesAPI>) => {
    return response.data.results;
  });
}
