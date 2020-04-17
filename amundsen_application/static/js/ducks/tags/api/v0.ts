import axios, { AxiosResponse } from 'axios';

import { sortTagsAlphabetical } from 'ducks/utilMethods';
import { Tag } from 'interfaces';
import { getTableQueryParams, getTableTagsFromResponseData } from 'ducks/tableMetadata/api/helpers';
import { API_PATH, TableDataAPI } from 'ducks/tableMetadata/api/v0';

export type AllTagsAPI = {
  msg: string;
  tags: Tag[];
};

export function getAllTags() {
  return axios.get('/api/metadata/v0/tags').then((response: AxiosResponse<AllTagsAPI>) => {
    return response.data.tags.sort(sortTagsAlphabetical);
  })
};

export function getTableTags(tableKey: string) {
  const tableParams = getTableQueryParams(tableKey);
  return axios.get(`${API_PATH}/table?${tableParams}`)
  .then((response: AxiosResponse<TableDataAPI>) => {
    return getTableTagsFromResponseData(response.data);
  });
}

/* TODO: Typing this method generates redux-saga related type errors that needs more dedicated debugging */
export function updateTableTags(tagArray, tableKey: string) {
  const updatePayloads = tagArray.map((tagObject) => {
    return {
      method: tagObject.methodName,
      url: `${API_PATH}/update_table_tags`,
      data: {
        key: tableKey,
        tag: tagObject.tagName,
      },
    }
  });
  return updatePayloads.map(payload => { axios(payload) });
}
