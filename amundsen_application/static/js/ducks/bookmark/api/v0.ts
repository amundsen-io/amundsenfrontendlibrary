import axios, { AxiosResponse, AxiosError } from 'axios';


const API_PATH = '/api/metadata/v0';

 // Add or remove bookmarks for the logged in user
export function addBookmark(action) {
  const { resourceKey, resourceType } = action;
  return axios.put(`${API_PATH}/bookmark?type=${resourceType}&key=${resourceKey}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
}

 export function removeBookmark(action) {
  const { resourceKey, resourceType } = action;
  return axios.delete(`${API_PATH}/bookmark?type=${resourceType}&key=${resourceKey}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })

 }

 // Get logged in user's bookmarks
export function getBookmarks() {
  return axios.get(`${API_PATH}/bookmark`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
 }

 // Get other user's bookmarks
export function getBookmarksForUser(action) {
  const { user } = action;
  return axios.get(`${API_PATH}/bookmark?user=${user}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
}
