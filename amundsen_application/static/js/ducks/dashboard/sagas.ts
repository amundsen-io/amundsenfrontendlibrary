import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import * as API from './api/v0';
import { getDashboardSuccess, getDashboardFailure, setDashboardPreview } from './reducer';
import { GetDashboard, GetDashboardPreview, GetDashboardPreviewRequest } from './types';

export function* getDashboardWorker(action): SagaIterator {
  try {
    const uri = action.payload.uri;
    const { dashboard, statusCode } = yield call(API.getDashboard, uri);
    yield put(getDashboardSuccess(dashboard, statusCode));
  } catch (e) {
    yield put(getDashboardFailure());
  }
}

export function* getDashboardWatcher(): SagaIterator {
  yield takeEvery(GetDashboard.REQUEST, getDashboardWorker);
}

export function* getDashboardPreviewWorker(action: GetDashboardPreviewRequest): SagaIterator {
  try {
    const payload = yield call(API.getDashboardPreview, action.payload.uri);
    yield put(setDashboardPreview(payload));
  } catch (error) {
    /*
      For this case the api call caught and parsed the error response into the shape the application
      needs, and has returned that payload.
    */
    yield put(setDashboardPreview(error));
  }
}

export function* getDashboardPreviewWatcher(): SagaIterator {
  yield takeEvery(GetDashboardPreview.REQUEST, getDashboardPreviewWorker);
}
