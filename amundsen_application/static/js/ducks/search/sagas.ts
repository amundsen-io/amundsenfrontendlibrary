import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import * as qs from 'simple-query-string';

import { ResourceType } from 'interfaces/Resources';

import * as API from './api/v0';

import {
  LoadPreviousSearch,
  LoadPreviousSearchRequest,
  SearchAll,
  SearchAllRequest,
  SearchResource,
  SearchResourceRequest,
  SetPageIndex,
  SetPageIndexRequest, SetResource, SetResourceRequest,
  SubmitSearch,
  SubmitSearchRequest,
  UrlDidUpdate,
  UrlDidUpdateRequest,
} from './types';

import {
  initialState,
  searchAll,
  searchAllFailure,
  searchAllSuccess,
  SearchReducerState,
  searchResource,
  searchResourceFailure,
  searchResourceSuccess,
} from './reducer';
import { GlobalState } from 'ducks/rootReducer';
import { updateSearchUrl } from 'utils/navigation-utils';

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
      isLoading: false,
    };
    const pageIndex = getPageIndex(searchAllResponse, resource);

    updateSearchUrl(term, resource, pageIndex);

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
  yield put(searchAll(action.payload.searchTerm, ResourceType.table, 0));

  const state = yield select(getSearchState);
  updateSearchUrl(state.search_term);
};
export function* submitSearchWatcher(): SagaIterator {
  yield takeEvery(SubmitSearch.REQUEST, submitSearchWorker);
}

export function* setResourceWorker(action: SetResourceRequest): SagaIterator {
  const resource = action.payload.resource;
  const state = yield select(getSearchState);
  updateSearchUrl(state.search_term, resource, getPageIndex(state, resource));
};
export function* setResourceWatcher(): SagaIterator {
  yield takeEvery(SetResource.REQUEST, setResourceWorker);
}


export function* setPageIndexWorker(action: SetPageIndexRequest): SagaIterator {
  const index = action.payload.pageIndex;
  const state = yield select(getSearchState);
  yield put(searchResource(state.search_term, state.selectedTab, index));
};
export function* setPageIndexWatcher(): SagaIterator {
  yield takeEvery(SetPageIndex.REQUEST, setPageIndexWorker);
}

export function* urlDidUpdateWorker(action: UrlDidUpdateRequest): SagaIterator {
  const { urlSearch } = action.payload;
  const { searchTerm, resource, pageIndex } = qs.parse(urlSearch);

  const state = yield select(getSearchState);
  // TODO - fill out other cases
  if (!!searchTerm && state.search_term !== searchTerm) {
    yield put(searchAll(searchTerm, resource, pageIndex));
  }

};
export function* urlDidUpdateWatcher(): SagaIterator {
  yield takeEvery(UrlDidUpdate.REQUEST, urlDidUpdateWorker);
}

export function* loadPreviousSearchWorker(action: LoadPreviousSearchRequest): SagaIterator {
};
export function* loadPreviousSearchWatcher(): SagaIterator {
  yield takeEvery(LoadPreviousSearch.REQUEST, loadPreviousSearchWorker);
}

const getPageIndex = (state: SearchReducerState, resource?: ResourceType) => {
  resource = resource || state.selectedTab;
  switch(resource) {
    case ResourceType.table:
      return state.tables.page_index;
    case ResourceType.user:
      return state.users.page_index;
    case ResourceType.dashboard:
      return state.dashboards.page_index;
  };
  return 0;
};
