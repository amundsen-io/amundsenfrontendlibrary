import axios, { AxiosResponse, AxiosError } from 'axios';


const API_PATH = '/api/metadata/v0';

export function addBookmark(resourceKey: string, resourceType: string) {
  return axios.put(`${API_PATH}/user/bookmark?type=${resourceType}&key=${resourceKey}`)
    .then((response: AxiosResponse) => {
      return response.data;
    });
}

export function removeBookmark(resourceKey: string, resourceType: string) {
  return axios.delete(`${API_PATH}/user/bookmark?type=${resourceType}&key=${resourceKey}`)
    .then((response: AxiosResponse) => {
      return response.data;
    });
 }

export function getBookmarks(user_id?: string) {
  let url = `${API_PATH}/user/bookmark` + (user_id ? `?user_id=${user_id}` : '');
  return axios.get(url)
    .then((response: AxiosResponse) => {
      return response.data;
    });
}
