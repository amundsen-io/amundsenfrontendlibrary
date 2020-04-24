import { Dashboard } from 'interfaces/Dashboard';

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
  payload: GetDashboardPayload;
}

export interface GetDashboardPayload {
  dashboard?: Dashboard;
  statusCode?: number;
  statusMessage?: string;
}

export enum GetDashboardPreview {
  REQUEST = 'amundsen/dashboard/GET_DASHBOARD_PREVIEW_REQUEST',
  RESPONSE = 'amundsen/dashboard/GET_DASHBOARD_PREVIEW_RESPONSE',
}
export interface GetDashboardPreviewRequest {
  type: GetDashboardPreview.REQUEST;
  payload: {
    uri: string;
  }
}
export interface GetDashboardPreviewResponse {
  type: GetDashboardPreview.RESPONSE;
  payload: DashboardPreviewResponse;
}
export interface DashboardPreviewResponse {
  url: string;
  errorMessage?: string | undefined;
  errorCode?: number;
}
