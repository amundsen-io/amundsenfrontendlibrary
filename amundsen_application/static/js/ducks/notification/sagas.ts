import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import { sendNotification } from './api/v0';

import { submitNotificationFailure, submitNotificationSuccess } from './reducer';
import { SubmitNotification, SubmitNotificationRequest } from './types';

export function* submitNotificationWorker(action: SubmitNotificationRequest): SagaIterator {
  try {
    yield call(sendNotification, action.payload.recipients, action.payload.sender, action.payload.notificationType, action.payload.options);
    yield put(submitNotificationSuccess());
  } catch(error) {
    yield put(submitNotificationFailure());
  }
}

export function* submitNotificationWatcher(): SagaIterator {
  yield takeEvery(SubmitNotification.REQUEST, submitNotificationWorker);
}
