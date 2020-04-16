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
    payload: {
      isLoading: false,
      statusCode: 500,
      dashboard: initialDashboardState,
    }
  }
}
export function getDashboardSuccess(dashboard, statusCode: number) {
  return {
    type: GetDashboard.SUCCESS,
    payload: {
      statusCode,
      dashboard,
      isLoading: false,
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
  statusCode: number;
  dashboard: Dashboard;
  preview: DashboardPreviewState;
}

export const initialDashboardState: Dashboard = {
  badges: [],
  chart_names: [],
  cluster: "",
  created_timestamp: null,
  description: "",
  frequent_users: [],
  group_name: "",
  group_url: "",
  last_run_state: "",
  last_run_timestamp: null,
  last_successful_run_timestamp: null,
  name: "",
  owners: [],
  query_names: [],
  recent_view_count: null,
  tables: [],
  tags: [],
  updated_timestamp: null,
  uri: "",
  url: "",
};

export const initialState: DashboardReducerState = {
  isLoading: true,
  statusCode: null,
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
        statusCode: null,
        isLoading: true,
      };
    case GetDashboard.FAILURE:
      return {
        ...state,
        isLoading: false,
        statusCode: action.payload.statusCode,
        dashboard: action.payload.dashboard,
      };
    case GetDashboard.SUCCESS:
      return {
        ...state,
        isLoading: false,
        statusCode: action.payload.statusCode,
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
