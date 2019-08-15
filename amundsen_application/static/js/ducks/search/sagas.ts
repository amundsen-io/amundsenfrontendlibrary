import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import browserHistory from 'utils/browser-history';

import { ResourceType } from 'interfaces/Resources';

import * as API from './api/v0';

import {
  LoadPreviousSearch,
  LoadPreviousSearchRequest,
  SearchAll,
  SearchAllRequest,
  SearchResource,
  SearchResourceRequest, SetPageIndex,
  SetPageIndexRequest,
  SubmitSearch,
  SubmitSearchRequest, UrlDidUpdate, UrlDidUpdateRequest,
} from './types';

import {
  initialState,
  searchAll,
  searchAllFailure,
  searchAllSuccess, SearchReducerState,
  searchResource,
  searchResourceFailure,
  searchResourceSuccess,
} from './reducer';
import { GlobalState } from 'ducks/rootReducer';

export const getSearchState = (state: GlobalState): SearchReducerState => state.search;

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
    const searchAllResponse = {
      search_term: term,
      selectedTab: resource,
      tables: tableResponse.tables || initialState.tables,
      users: userResponse.users || initialState.users,
      dashboards: dashboardResponse.dashboards || initialState.dashboards,
    };
    yield put(searchAllSuccess(searchAllResponse));
    browserHistory.push('/search?blablbalbal');
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

export function* submitSearchWorker(action: SubmitSearchRequest): SagaIterator {
  yield put(searchAll(action.payload.searchTerm))
  // TODO - implement auto-select resource here
};
export function* submitSearchWatcher(): SagaIterator {
  yield takeEvery(SubmitSearch.REQUEST, submitSearchWorker);
}

export function* setPageIndexWorker(action: SetPageIndexRequest): SagaIterator {
  const index = action.payload.pageIndex;
  // TODO - get better typing data
  const state = yield select(getSearchState);
  yield put(searchResource(state.search_term, state.selectedTab, index));
};
export function* setPageIndexWatcher(): SagaIterator {
  yield takeEvery(SetPageIndex.REQUEST, setPageIndexWorker);
}

export function* urlDidUpdateWorker(action: UrlDidUpdateRequest): SagaIterator {
};
export function* urlDidUpdateWatcher(): SagaIterator {
  yield takeEvery(UrlDidUpdate.REQUEST, urlDidUpdateWorker);
}

export function* loadPreviousSearchWorker(action: LoadPreviousSearchRequest): SagaIterator {
};
export function* loadPreviousSearchWatcher(): SagaIterator {
  yield takeEvery(LoadPreviousSearch.REQUEST, loadPreviousSearchWorker);
}

// https://github.com/ReactTraining/react-router/issues/3972#issuecomment-264805667
