import { GetDashboard, GetDashboardRequest } from 'ducks/dashboard/types';
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


/* Reducer */

export interface DashboardReducerState {
  isLoading: boolean;
  statusCode: number;
  dashboard: Dashboard;
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
    default:
      return state;
  };
}
