import axios, { AxiosResponse } from 'axios';

import { Dashboard } from 'interfaces/Dashboard';

export type GetDashboardAPI = {
  msg: string;
  dashboard: Dashboard;
}

const DASHBOARD_BASE = '/api/metadata/v0';

export function getDashboard(uri: string) {
  return axios.get(`${DASHBOARD_BASE}/dashboard?uri=${uri}`)
  .then((response: AxiosResponse<GetDashboardAPI>) => {
    const { data, status } = response;
    return {
      dashboard: data.dashboard,
      statusCode: status
    };
  })
  .catch((e) => {
    const response = e.response;
    const statusMessage = response ? (response.data ? response.data.msg : undefined) : undefined;
    const statusCode = response ? (response.status || 500) : 500;
    return Promise.reject({
      statusCode,
      statusMessage,
    })
  });
}
