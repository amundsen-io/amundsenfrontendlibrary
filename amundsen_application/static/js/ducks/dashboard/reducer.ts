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


/* Reducer */

export interface DashboardReducerState {
  isLoading: boolean;
  dashboard: Dashboard;
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
    default:
      return state;
  };
}
