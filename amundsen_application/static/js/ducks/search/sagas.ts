import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  SearchAll,
  SearchAllRequest,
  SearchResource,
  SearchResourceRequest,
} from './types';

import {
  searchAll, searchResource,
} from './api/v0';

import {
  searchAllSuccess, searchAllFailure,
  searchResourceSuccess, searchResourceFailure,
} from './reducer';

export function* searchAllWorker(action: SearchAllRequest): SagaIterator {
  const { options, term } = action.payload;
  try {
    const searchResults = yield call(searchAll, options, term);
    yield put(searchAllSuccess(searchResults));
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
