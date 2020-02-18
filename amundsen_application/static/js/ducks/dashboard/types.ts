export enum GetDashboard {
  REQUEST = 'amundsen/dashboard/GET_DASHBOARD_REQUEST',
  SUCCESS = 'amundsen/dashboard/GET_DASHBOARD_SUCCESS',
  FAILURE = 'amundsen/dashboard/GET_DASHBOARD_FAILURE',
}

export interface GetDashboardRequest {
  type: GetDashboard.REQUEST;
  payload: {
    uri: string;
    searchIndex?: string;
    source?: string;
  }
}

export interface GetDashboardResponse {
  type: GetDashboard.SUCCESS | GetDashboard.FAILURE;
  payload: {
    dashboard: any;
  }
}
