import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import * as API from './api/v0';
import { getDashboardSuccess, getDashboardFailure, setDashboardPreview } from './reducer';
import { GetDashboard } from './types';

export function* getDashboardWorker(action): SagaIterator {
  try {
    const uri = action.payload.uri;
    const dashboard = yield call(API.getDashboard, uri);
    yield put(getDashboardSuccess(dashboard));
  } catch (e) {
    yield put(getDashboardFailure());
  }
}

export function* getDashboardWatcher(): SagaIterator {
  yield takeEvery(GetDashboard.REQUEST, getDashboardWorker);
}

export function* getDashboardPreviewWorker(action): SagaIterator {
  try {
    const payload = yield call(API.getDashboardPreview, action.payload.uri);
    yield put(setDashboardPreview(payload));
  } catch (error) {
    yield put(setDashboardPreview(error));
  }
}

export function* getDashboardPreviewWatcher(): SagaIterator {
  yield takeEvery('GETPREVIEW', getDashboardPreviewWorker);
}
