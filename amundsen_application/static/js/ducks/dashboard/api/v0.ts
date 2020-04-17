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
    return response.data.dashboard;
  });
}
