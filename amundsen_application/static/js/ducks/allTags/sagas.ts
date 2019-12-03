import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import AppConfig from 'config/config';
import * as API from './api/v0';
import { getAllTagsFailure, getAllTagsSuccess } from './reducer';
import { GetAllTags } from './types';

export function* getAllTagsWorker(): SagaIterator {
  try {
    const allTags = yield call(API.getAllTags);
    const curatedTagsList = AppConfig.browse.curatedTags;
    const curatedTags = allTags.filter((tag) => curatedTagsList.indexOf(tag.tag_name) !== -1);
    const otherTags = allTags.filter((tag) => curatedTagsList.indexOf(tag.tag_name) === -1);
    yield put(getAllTagsSuccess(allTags, curatedTags, otherTags));
  } catch (e) {
    yield put(getAllTagsFailure());
  }
}
export function* getAllTagsWatcher(): SagaIterator {
  yield takeEvery(GetAllTags.REQUEST, getAllTagsWorker);
}
