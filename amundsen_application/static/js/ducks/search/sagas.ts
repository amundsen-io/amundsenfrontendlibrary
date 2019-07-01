import { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import {
  SearchAll,
  SearchAllRequest,
  SearchResource,
  SearchResourceRequest,
} from './types';

import {
  searchResource,
} from './api/v0';
import { ResourceType } from 'interfaces/Resources';

import {
  searchAllFailure,
  searchResourceSuccess,
  searchResourceFailure, initialState,
} from './reducer';

export function* searchAllWorker(action: SearchAllRequest): SagaIterator {
  const { selectedTab, pageIndex, term } = action.payload;
  const tableIndex = selectedTab === ResourceType.table? pageIndex : 0;
  const userIndex = selectedTab === ResourceType.user? pageIndex : 0;
  const dashboardIndex = selectedTab === ResourceType.dashboard? pageIndex : 0;

  try {
    const [tableResponse, userResponse, dashboardResponse] = yield all([
      call(searchResource, tableIndex, ResourceType.table, term),
      call(searchResource, userIndex, ResourceType.user, term),
      call(searchResource, dashboardIndex, ResourceType.dashboard, term),
    ]);
    const searchAllResponse = {
      selectedTab,
      search_term: term,
      tables: tableResponse.tables || initialState.tables,
      users: userResponse.users || initialState.users,
      dashboards: dashboardResponse.dashboards || initialState.dashboards,
    };
    yield put({ type: SearchAll.SUCCESS, payload: searchAllResponse });
  } catch (e) {
    yield put(searchAllFailure());
  }
};
export function* searchAllWatcher(): SagaIterator {
  yield takeEvery(SearchAll.REQUEST, searchAllWorker);
};

export function* searchResourceWorker(action: SearchResourceRequest): SagaIterator {
  const { pageIndex, resource, term } = action.payload;
  try {
    const searchResults = yield call(searchResource, pageIndex, resource, term);
    yield put(searchResourceSuccess(searchResults));
  } catch (e) {
    yield put(searchResourceFailure());
  }
}
export function* searchResourceWatcher(): SagaIterator {
  yield takeEvery(SearchResource.REQUEST, searchResourceWorker);
}
