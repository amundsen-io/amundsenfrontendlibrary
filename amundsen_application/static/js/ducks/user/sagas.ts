import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { GetCurrentUser, GetUser, GetUserRequest } from './types';
import { getCurrentUser, getUserById } from './api/v0';

export function* getCurrentUserWorker(): SagaIterator {
  try {
    const user = yield call(getCurrentUser);
    const otherUserInfo = yield call(getUserById, user.user_id);
    yield put({ type: GetCurrentUser.SUCCESS, payload: { ...otherUserInfo, ...user }});
  } catch (e) {
    yield put({ type: GetCurrentUser.FAILURE });
  }
}

export function* getCurrentUserWatcher(): SagaIterator {
  yield takeEvery(GetCurrentUser.ACTION, getCurrentUserWorker);
}

export function* getUserWorker(action: GetUserRequest): SagaIterator {
  try {
    const user = yield call(getUserById, action.userId);
    yield put({ type: GetUser.SUCCESS, payload: user });
  } catch (e) {
    yield put({ type: GetUser.FAILURE});
  }
}

export function* getUserWatcher(): SagaIterator {
  yield takeEvery(GetUser.ACTION, getUserWorker);
}
