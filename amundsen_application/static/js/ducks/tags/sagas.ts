import { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import { updateTagsFailure, updateTagsSuccess, getAllTagsFailure, getAllTagsSuccess } from './reducer';

import * as API from './api/v0';

import { GetAllTags, UpdateTags, UpdateTagsRequest } from './types';



export function* getAllTagsWorker(): SagaIterator {
  try {
    const allTags = yield call(API.getAllTags);

    yield put(getAllTagsSuccess(allTags));
  } catch (e) {
    yield put(getAllTagsFailure());
  }
}
export function* getAllTagsWatcher(): SagaIterator {
  yield takeEvery(GetAllTags.REQUEST, getAllTagsWorker);
}


export function* updateTableTagsWorker(action: UpdateTagsRequest): SagaIterator {
  try {
    const { tagArray, resourceType, uriKey } = action.payload;


    yield all(API.updateTableTags(tagArray, resourceType, uriKey));
    const newTags = yield call(API.getTags, resourceType, uriKey);
    yield put(updateTagsSuccess(newTags));
  } catch (e) {
    yield put(updateTagsFailure());
  }
};
export function* updateTableTagsWatcher(): SagaIterator {
  yield takeEvery(UpdateTags.REQUEST, updateTableTagsWorker);
};
