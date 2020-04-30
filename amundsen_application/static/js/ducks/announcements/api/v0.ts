import { AxiosResponse } from 'axios';
import axiosInstance from 'axiosInstance/instance';

import { AnnouncementPost } from 'interfaces';

export type AnnouncementsAPI = {
  msg: string;
  posts: AnnouncementPost[];
};

export function getAnnouncements() {
  return axiosInstance({
      method: 'get',
      url: '/api/announcements/v0/',
    })
    .then((response: AxiosResponse<AnnouncementsAPI>) => {
      return response.data.posts;
    })
};
