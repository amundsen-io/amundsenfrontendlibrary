import axios, { AxiosResponse, AxiosError } from 'axios';

import { CurrentUser, UserResponse } from '../types';

export function getCurrentUser() {
  return axios.get(`/api/current_user`)
    .then((response: AxiosResponse<CurrentUser>) => {
      return response.data;
    }).catch((error: AxiosError) => {
      return {};
    });
}

export function getUserById(userId: string) {
  return axios.get(`/api/metadata/v0/user?user_id=${userId}`)
  .then((response: AxiosResponse<UserResponse>) => {
    return response.data.user;
  })
  .catch((error: AxiosError) => {
    return {};
  });
}
