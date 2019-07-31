import { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import { DEFAULT_RESOURCE_TYPE, ResourceType } from 'interfaces/Resources';

import * as API from './api/v0';

import { SearchAll, SearchAllRequest, SearchResource, SearchResourceRequest, } from './types';

import {
  initialState,
  searchAllFailure,
  searchAllSuccess,
  searchResourceFailure,
  searchResourceSuccess,
} from './reducer';

export function* searchAllWorker(action: SearchAllRequest): SagaIterator {
  const { resource, pageIndex, term } = action.payload;
  const tableIndex = resource === ResourceType.table ? pageIndex : 0;
  const userIndex = resource === ResourceType.user ? pageIndex : 0;
  const dashboardIndex = resource === ResourceType.dashboard ? pageIndex : 0;

  try {
    const [tableResponse, userResponse, dashboardResponse] = yield all([
      call(API.searchResource, tableIndex, ResourceType.table, term),
      call(API.searchResource, userIndex, ResourceType.user, term),
      call(API.searchResource, dashboardIndex, ResourceType.dashboard, term),
    ]);
    const response = {
      search_term: term,
      selectedTab: resource || DEFAULT_RESOURCE_TYPE,
      tables: tableResponse.tables || initialState.tables,
      users: userResponse.users || initialState.users,
      dashboards: dashboardResponse.dashboards || initialState.dashboards,
    };

    if (resource == null) {
      console.log('resource is null');
      if (response.tables.total_results > 0) {
        response.selectedTab = ResourceType.table;
      } else if (response.users.total_results > 0) {
        response.selectedTab = ResourceType.user;
      }
    }


    yield put(searchAllSuccess(response));
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
    const searchResults = yield call(API.searchResource, pageIndex, resource, term);
    yield put(searchResourceSuccess(searchResults));
  } catch (e) {
    yield put(searchResourceFailure());
  }
}
export function* searchResourceWatcher(): SagaIterator {
  yield takeEvery(SearchResource.REQUEST, searchResourceWorker);
}
