import axios, { AxiosResponse, AxiosError } from 'axios';


 // Add or remove bookmarks for the logged in user
export function addBookmark(action) {
  const { key } = action;
  return axios.put(`/api/metadata/v0/bookmarks?key=${key}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
}

 export function removeBookmark(action) {
  const { key } = action;
  return axios.delete(`/api/metadata/v0/bookmarks?key=${key}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })

 }

 // Get logged in user's bookmarks
export function getBookmarks(action) {
  return axios.get(`/api/metadata/v0/bookmarks`)
    .then((response: AxiosResponse) => {
      return response.data;
    })

 }


 // Get other user's bookmarks
export function getBookmarksForUser(action) {
  const { user } = action;
  return axios.get(`/api/metadata/v0/bookmarks?user=${user}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
}
