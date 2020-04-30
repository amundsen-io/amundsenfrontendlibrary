import { AxiosResponse } from 'axios';
import axiosInstance from 'axiosInstance/instance';

import { sortTagsAlphabetical } from 'ducks/utilMethods';
import { Tag } from 'interfaces';

export type AllTagsAPI = {
  msg: string;
  tags: Tag[];
};

export function getAllTags() {
  return axiosInstance.get('/api/metadata/v0/tags').then((response: AxiosResponse<AllTagsAPI>) => {
    return response.data.tags.sort(sortTagsAlphabetical);
  })
};
