import axios, { AxiosResponse } from 'axios';

import { sortTagsAlphabetical } from 'ducks/utilMethods';
import { ResourceType, Tag } from 'interfaces';
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

export function getTags(resourceType, uriKey: string) {
  let url = "";
  if (resourceType === ResourceType.table) {
    url = `${API_PATH}/table?key=${uriKey}`;
  } else if (resourceType === ResourceType.dashboard) {
    url = `${API_PATH}/dashboard?uri=${uriKey}`;
  }
  return axios.get(url)
  .then((response: AxiosResponse) => {
    return response.data.tags;
  });
}

/* TODO: Typing this method generates redux-saga related type errors that needs more dedicated debugging */
export function updateTableTags(tagArray, resourceType: ResourceType, uriKey: string) {
  let url = "";
  switch (resourceType) {
    case ResourceType.table:
      url = `${API_PATH}/update_table_tags`;
      break;
    case ResourceType.dashboard:
      url = `${API_PATH}/update_dashboard_tags`;
      break;
  }
  const updatePayloads = tagArray.map((tagObject) => {
    return {
      url,
      method: tagObject.methodName,
      data: {
        key: uriKey,
        tag: tagObject.tagName,
      },
    }
  });
  return updatePayloads.map(payload => { axios(payload) });
}
