import axios, { AxiosResponse } from 'axios';

import { sortTagsAlphabetical } from 'ducks/utilMethods';
import { ResourceType, Tag } from 'interfaces';
import { getTableTagsFromResponseData } from 'ducks/tableMetadata/api/helpers';
import { API_PATH, TableDataAPI } from 'ducks/tableMetadata/api/v0';
import { GetDashboardAPI } from 'ducks/dashboard/api/v0';
import { getDashboardTagsFromResponseData } from 'ducks/dashboard/api/helpers';

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
  if (resourceType === ResourceType.table) {
    return axios.get(`${API_PATH}/table?key=${uriKey}`)
    .then((response: AxiosResponse<TableDataAPI>) => {
      return getTableTagsFromResponseData(response.data);
    });
  }
  if (resourceType === ResourceType.dashboard) {
    return axios.get(`${API_PATH}/dashboard?uri=${uriKey}`)
    .then((response: AxiosResponse<GetDashboardAPI>) => {
      return getDashboardTagsFromResponseData(response.data)
    });
  }
}

/* TODO: Typing this method generates redux-saga related type errors that needs more dedicated debugging */
export function updateTableTag(tagObject, resourceType: ResourceType, uriKey: string) {
  let url = "";
  if (resourceType === ResourceType.table) {
    url = `${API_PATH}/update_table_tags`;
  } else if (resourceType === ResourceType.dashboard) {
    url = `${API_PATH}/update_dashboard_tags`;
  }
  return axios({
    url,
    method: tagObject.methodName,
    data: {
      key: uriKey,
      tag: tagObject.tagName,
    },
  });
}
