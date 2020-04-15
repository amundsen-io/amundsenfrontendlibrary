import {
  GetDashboard,
  GetDashboardRequest,
  GetDashboardPreview,
  GetDashboardPreviewRequest,
  GetDashboardPreviewResponse,
  DashboardPreviewResponse,
} from 'ducks/dashboard/types';
import { Dashboard } from 'interfaces/Dashboard';


/* Actions */

export function getDashboard(payload: { uri: string, searchIndex?: string, source?: string }): GetDashboardRequest {
  return {
    payload,
    type: GetDashboard.REQUEST,
  }
}

export function getDashboardFailure() {
  return {
    type: GetDashboard.FAILURE,
    payload: {}
  }
}
export function getDashboardSuccess(dashboard) {
  return {
    type: GetDashboard.SUCCESS,
    payload: {
      dashboard,
    }
  }
}

export function getDashboardPreview(payload: { uri: string }): GetDashboardPreviewRequest {
  return {
    payload,
    type: GetDashboardPreview.REQUEST,
  }
}

export function setDashboardPreview(payload: DashboardPreviewResponse): GetDashboardPreviewResponse {
  return {
    payload,
    type: GetDashboardPreview.RESPONSE,
  }
}


/* Reducer */
interface DashboardPreviewState extends DashboardPreviewResponse {
  isLoading: boolean;
}
export interface DashboardReducerState {
  isLoading: boolean;
  dashboard: Dashboard;
  preview: DashboardPreviewState;
}

export const initialDashboardState: Dashboard = {
  uri: '',
  cluster: '',
  group_name: '',
  group_url: '',
  name: '',
  url: '',
  description: '',
  created_timestamp: null,
  updated_timestamp: null,
  last_run_timestamp: null,
  last_run_state: '',
  owners: [],
  frequent_users: [],
  chart_names: [],
  query_names: [],
  tables: [],
  tags: [],
};

export const initialState: DashboardReducerState = {
  isLoading: true,
  dashboard: initialDashboardState,
  preview: {
    url: '',
    isLoading: true,
  }
};

export default function reducer(state: DashboardReducerState = initialState, action): DashboardReducerState {
  switch (action.type) {
    case GetDashboard.REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GetDashboard.FAILURE:
      return {
        ...state,
        isLoading: false,
        dashboard: initialDashboardState,
      };
    case GetDashboard.SUCCESS:
      return {
        ...state,
        isLoading: false,
        dashboard: action.payload.dashboard,
      };
    case GetDashboardPreview.REQUEST:
      return {
        ...state,
        preview: {
          url: '',
          isLoading: true,
        }
      };
    case GetDashboardPreview.RESPONSE:
      return {
        ...state,
        preview: {
          ...action.payload,
          isLoading: false,
        }
      };
    default:
      return state;
  };
}
