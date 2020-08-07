import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as API from 'ducks/lastIndexed/api/v0';
import { getLastIndexedFailure, getLastIndexedSuccess } from './reducer';
import { GetLastIndexed, GetLastIndexedRequest } from './types';

export function* getLastIndexedWorker(
  action: GetLastIndexedRequest
): SagaIterator {
  try {
    const lastIndexed = yield call(API.getLastIndexed);
    yield put(getLastIndexedSuccess(lastIndexed));
  } catch (e) {
    yield put(getLastIndexedFailure());
  }
}
export function* getLastIndexedWatcher(): SagaIterator {
  yield takeEvery(GetLastIndexed.REQUEST, getLastIndexedWorker);
}
