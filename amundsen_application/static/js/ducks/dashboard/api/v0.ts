import axios, { AxiosResponse } from 'axios';

import { DashboardPreviewResponse } from 'ducks/dashboard/types';
import { Dashboard } from 'interfaces/Dashboard';

export type GetDashboardAPI = {
  msg: string;
  dashboard: Dashboard;
}


const DASHBOARD_BASE = '/api/dashboard/v0';
const DASHBOARD_PREVIEW_BASE = '/api/dashboard_preview/v0/dashboard'

export function getDashboard(uri: string) {
  return axios.get(`${DASHBOARD_BASE}/dashboard?uri=${uri}`)
  .then((response: AxiosResponse<GetDashboardAPI>) => {
    return response.data.dashboard;
  });
}

export function getDashboardPreview(uri: string): Promise<DashboardPreviewResponse> {
  const imageSrc = `${DASHBOARD_PREVIEW_BASE}/${uri}/preview.jpg`;
  return axios.get(imageSrc)
  .then((response) => {
    return {
      url: imageSrc
    };
  })
  .catch((e) => {
    const response = e.response;
    const errorMessage = response ? (response.data ? response.data.msg : undefined) : undefined;
    const errorCode = response ? (response.status || 500) : 500;
    return Promise.reject({
      errorCode,
      errorMessage,
      url: imageSrc,
    })
  });
}
