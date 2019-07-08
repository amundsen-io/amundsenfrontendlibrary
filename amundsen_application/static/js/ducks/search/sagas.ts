import { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import {
  SearchAll,
  SearchAllRequest,
  SearchResource,
  SearchResponsePayload,
  SearchResourceRequest,
} from './types';

import { searchResource } from './api/v0';
import { ResourceType } from 'interfaces/Resources';

import {
  initialState,
  searchAllSuccess,
  searchAllFailure,
  searchResourceSuccess,
  searchResourceFailure,
} from './reducer';

export function* searchAllWorker(action: SearchAllRequest): SagaIterator {
  const { resource, pageIndex, term } = action.payload;
  const tableIndex = resource === ResourceType.table ? pageIndex : 0;
  const userIndex = resource === ResourceType.user ? pageIndex : 0;
  const dashboardIndex = resource === ResourceType.dashboard ? pageIndex : 0;

  try {
    const [tableResponse, userResponse, dashboardResponse] = yield all([
      call(searchResource, tableIndex, ResourceType.table, term),
      call(searchResource, userIndex, ResourceType.user, term),
      call(searchResource, dashboardIndex, ResourceType.dashboard, term),
    ]);
    const searchAllResponse: SearchResponsePayload = {
      selectedTab: resource,
      search_term: term,
      tables: tableResponse.tables || initialState.tables,
      users: userResponse.users || initialState.users,
      dashboards: dashboardResponse.dashboards || initialState.dashboards,
    };
    yield put(searchAllSuccess(searchAllResponse));
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
