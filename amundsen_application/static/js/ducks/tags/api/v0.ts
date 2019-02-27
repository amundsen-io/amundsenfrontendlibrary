import axios from 'axios';

const sortTagsAlphabetical = (a, b) => a.tag_name.localeCompare(b.tag_name);

export function metadataAllTags() {
  return axios.get('/api/metadata/v0/tags').then((response) => {
    return response.data.tags.sort(sortTagsAlphabetical);
  })
  .catch((error) => {
    return error.response.data.tags.sort(sortTagsAlphabetical);
  });
}
