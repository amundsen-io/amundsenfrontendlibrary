import axios, { AxiosResponse } from 'axios';

import { sortTagsAlphabetical } from 'ducks/utilMethods';
import { TagsInterface } from 'interfaces/Tags';

export type AllTagsResponseAPI = {
  msg: string;
  tags: TagsInterface.Tag[];
}

export function metadataAllTags() {
  return axios.get('/api/metadata/v0/tags').then((response: AxiosResponse<AllTagsResponseAPI>) => {
    return response.data.tags.sort(sortTagsAlphabetical);
  })
}
