import axios, { AxiosResponse, AxiosError } from 'axios';

import { AnnouncementsPayload } from '../types';

export function announcementsGet() {
  return axios({
      method: 'get',
      url: '/api/announcements/v0/',
    })
    .then((response: AxiosResponse<AnnouncementsPayload>) => {
      return response.data.posts;
    })
    .catch((error: AxiosError) => {
      return [];
    });
}
