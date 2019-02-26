import { all, call, select, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { UpdateTableOwner, UpdateTableOwnerRequest } from './reducer';

import { metadataUpdateTableOwner } from '../api/v0';

// updateTableOwner
export function* updateTableOwnerWorker(action: UpdateTableOwnerRequest): SagaIterator {
  const state = yield select();
  try {
    yield all(metadataUpdateTableOwner(action, state.tableMetadata.tableData));
    if (action.onSuccess) {
      yield call(action.onSuccess);
    }
  } catch (e) {
    if (action.onFailure) {
      yield call(action.onFailure);
    }
  }
}

export function* updateTableOwnerWatcher(): SagaIterator {
  yield takeEvery(UpdateTableOwner.ACTION, updateTableOwnerWorker);
}
