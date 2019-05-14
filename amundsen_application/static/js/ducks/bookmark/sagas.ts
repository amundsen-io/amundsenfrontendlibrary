import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

 import {
  AddBookmark,
  AddBookmarkRequest,
  GetBookmarks,
  GetBookmarksForUser,
  GetBookmarksForUserRequest,
  GetBookmarksRequest,
  RemoveBookmark,
  RemoveBookmarkRequest
} from "./types";

 import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  getBookmarksForUser,
} from "./api/v0";


 // AddBookmarks
export function* addBookmarkWorker(action: AddBookmarkRequest): SagaIterator {
  try {
    const response = yield call(addBookmark, action);
  } catch(e) {

   }
}
export function* addBookmarkWatcher(): SagaIterator {
  yield takeEvery(AddBookmark.ACTION , addBookmarkWorker)
}


 // RemoveBookmarks
export function* removeBookmarkWorker(action: RemoveBookmarkRequest): SagaIterator {
  try {
    const response = yield call(removeBookmark, action);
  } catch(e) {

   }
}
export function* removeBookmarkWatcher(): SagaIterator {
  yield takeEvery(RemoveBookmark.ACTION , removeBookmarkWorker)
}


 // GetBookmarks
export function* getBookmarksWorker(action: GetBookmarksRequest): SagaIterator {
  let response;
  try {
    response = yield call(getBookmarks, action);
    yield put({ type: GetBookmarks.SUCCESS, payload: response.bookmark.table });
  } catch(e) {
    yield put({ type: GetBookmarks.FAILURE, payload: response });
  }
}
export function* getBookmarkskWatcher(): SagaIterator {
  yield takeEvery(GetBookmarks.ACTION, getBookmarksWorker)
}


 // GetBookmarksForUser
export function* getBookmarkForUserWorker(action: GetBookmarksForUserRequest): SagaIterator {
  let response;
  try {
    response = yield call(getBookmarksForUser, action);
    yield put({ type: GetBookmarksForUser.SUCCESS, payload: response.bookmark.table });
  } catch(e) {
    yield put({ type: GetBookmarksForUser.FAILURE, payload: response });
   }
}
export function* getBookmarksForUserWatcher(): SagaIterator {
  yield takeEvery(GetBookmarksForUser.ACTION, getBookmarkForUserWorker)
}
