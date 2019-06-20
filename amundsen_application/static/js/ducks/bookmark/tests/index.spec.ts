import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { Bookmark, ResourceType } from 'interfaces';

import { addBookmark as addBkmrk, getBookmarks as getBkmrks, removeBookmark as removeBkmrk } from '../api/v0';
import reducer, {
  addBookmark, addBookmarkFailure, addBookmarkSuccess,
  getBookmarks, getBookmarksFailure, getBookmarksSuccess,
  getBookmarksForUser, getBookmarksForUserFailure, getBookmarksForUserSuccess,
  removeBookmark, removeBookmarkFailure, removeBookmarkSuccess,
  initialState, BookmarkReducerState
} from '../reducer';
import {
  addBookmarkWatcher, addBookmarkWorker,
  getBookmarksWatcher, getBookmarksWorker,
  getBookmarksForUserWatcher, getBookmarkForUserWorker,
  removeBookmarkWatcher, removeBookmarkWorker,
} from '../sagas';
import {
  AddBookmark, AddBookmarkRequest,
  GetBookmarks,
  GetBookmarksForUser, GetBookmarksForUserRequest,
  RemoveBookmark, RemoveBookmarkRequest,
} from '../types';

describe('bookmark ducks', () => {
  let bookmarks: Bookmark[];
  let testResourceKey: string;
  let testResourceType: string;
  let testUserId: string;
  beforeAll(() => {
    testResourceKey = 'key';
    testResourceType = ResourceType.table;
    testUserId = 'userId';
    bookmarks = [
      {
        key: testResourceKey,
        type: testResourceType,
        cluster: 'cluster',
        database: 'database',
        description: 'description',
        name: 'name',
        schema_name: 'schema_name',
      },
    ];
  });

  describe('actions', () => {
    it('addBookmark - returns the action to add a bookmark', () => {
      expect(addBookmark(testResourceKey, testResourceType)).toEqual({
        type: AddBookmark.REQUEST,
        payload: {
          resourceKey: testResourceKey,
          resourceType: testResourceType,
        },
      });
    });

    it('addBookmarkFailure - returns the action to process failure', () => {
      expect(addBookmarkFailure()).toEqual({
        type: AddBookmark.FAILURE,
      });
    });

    it('addBookmarkSuccess - returns the action to process success', () => {
      expect(addBookmarkSuccess(bookmarks)).toEqual({
        type: AddBookmark.SUCCESS,
        payload: {
          bookmarks,
        }
      });
    });

    it('getBookmarks - returns the action to get bookmarks', () => {
      expect(getBookmarks()).toEqual({ type: GetBookmarks.REQUEST });
    });

    it('getBookmarksFailure - returns the action to process failure', () => {
      expect(getBookmarksFailure()).toEqual({ type: GetBookmarks.FAILURE});
    });

    it('getBookmarksSuccess - returns the action to process success', () => {
      expect(getBookmarksSuccess(bookmarks)).toEqual({
        type: GetBookmarks.SUCCESS,
        payload: {
          bookmarks,
        }
      });
    });

    it('getBookmarksForUser - returns the action to get bookmarks for a user', () => {
      expect(getBookmarksForUser(testUserId)).toEqual({
        type: GetBookmarksForUser.REQUEST,
        payload: {
          userId: testUserId,
        },
      });
    });

    it('getBookmarksForUserFailure - returns the action to process failure', () => {
      expect(getBookmarksForUserFailure()).toEqual({ type: GetBookmarksForUser.FAILURE});
    });

    it('getBookmarksForUserSuccess - returns the action to process success', () => {
      expect(getBookmarksForUserSuccess(bookmarks)).toEqual({
        type: GetBookmarksForUser.SUCCESS,
        payload: {
          bookmarks,
        }
      });
    });

    it('removeBookmark - returns the action to remove a bookmark', () => {
      expect(removeBookmark(testResourceKey, testResourceType)).toEqual({
        type: RemoveBookmark.REQUEST,
        payload: {
          resourceKey: testResourceKey,
          resourceType: testResourceType,
        },
      });
    });

    it('removeBookmarkFailure - returns the action to process failure', () => {
      expect(removeBookmarkFailure()).toEqual({ type: RemoveBookmark.FAILURE});
    });

    it('removeBookmarkSuccess - returns the action to process success', () => {
      expect(removeBookmarkSuccess(testResourceKey, testResourceType)).toEqual({
        type: RemoveBookmark.SUCCESS,
        payload: {
          resourceKey: testResourceKey,
          resourceType: testResourceType,
        },
      });
    });
  });

  describe('reducer', () => {
    let testState: BookmarkReducerState;
    beforeAll(() => {
      testState = {
        myBookmarks: bookmarks,
        myBookmarksIsLoaded: false,
        bookmarksForUser: [],
      };
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
      expect(reducer(testState, addBookmarkFailure())).toEqual(testState);
      expect(reducer(testState, getBookmarksFailure())).toEqual(testState);
      expect(reducer(testState, getBookmarksForUserFailure())).toEqual(testState);
      expect(reducer(testState, removeBookmarkFailure())).toEqual(testState);
    });

    it('should handle RemoveBookmark.SUCCESS', () => {
      expect(reducer(testState, removeBookmarkSuccess(testResourceKey, testResourceType))).toEqual({
        ...testState,
        myBookmarks: [],
      });
    });

    it('should handle AddBookmark.SUCCESS', () => {
      expect(reducer(initialState, addBookmarkSuccess(bookmarks))).toEqual({
        ...initialState,
        myBookmarks: bookmarks,
        myBookmarksIsLoaded: true,
      });
    });

    it('should handle GetBookmarks.SUCCESS', () => {
      expect(reducer(initialState, getBookmarksSuccess(bookmarks))).toEqual({
        ...initialState,
        myBookmarks: bookmarks,
        myBookmarksIsLoaded: true,
      });
    });

    it('should handle GetBookmarksForUser.SUCCESS', () => {
      expect(reducer(initialState, getBookmarksForUserSuccess(bookmarks))).toEqual({
        ...initialState,
        bookmarksForUser: bookmarks,
      });
    });
  });

  describe('sagas', () => {
    describe('addBookmarkWatcher', () => {
      it('takes AddBookmark.REQUEST with addBookmarkWorker', () => {
        testSaga(addBookmarkWatcher)
          .next()
          .takeEvery(AddBookmark.REQUEST, addBookmarkWorker);
      });
    });

    describe('addBookmarkWorker', () => {
      let action: AddBookmarkRequest;
      beforeAll(() => {
        action = addBookmark(testResourceKey, testResourceType);
      })

      it('adds a bookmark', () => {
        return expectSaga(addBookmarkWorker, action)
          .provide([
            [matchers.call.fn(addBkmrk), {}],
            [matchers.call.fn(getBkmrks), { bookmarks }],
          ])
          .put(addBookmarkSuccess(bookmarks))
          .run();
      });

      it('handles request error', () => {
        return expectSaga(addBookmarkWorker, action)
          .provide([
            [matchers.call.fn(addBkmrk), throwError(new Error())],
            [matchers.call.fn(getBkmrks), throwError(new Error())],
          ])
          .put(addBookmarkFailure())
          .run();
      });
    });

    describe('getBookmarksWatcher', () => {
      it('takes GetBookmark.REQUEST with getBookmarksWorker', () => {
        testSaga(getBookmarksWatcher)
          .next()
          .takeEvery(GetBookmarks.REQUEST, getBookmarksWorker);
      });
    });

    describe('getBookmarksWorker', () => {
      it('gets bookmarks', () => {
        return expectSaga(getBookmarksWorker)
          .provide([
            [matchers.call.fn(getBkmrks), { bookmarks }],
          ])
          .put(getBookmarksSuccess(bookmarks))
          .run();
      });

      it('handles request error', () => {
        return expectSaga(getBookmarksWorker)
          .provide([
            [matchers.call.fn(getBkmrks), throwError(new Error())],
          ])
          .put(getBookmarksFailure())
          .run();
      });
    });

    describe('getBookmarksForUserWatcher', () => {
      it('takes GetBookmarksForUser.REQUEST with getBookmarkForUserWorker', () => {
        testSaga(getBookmarksForUserWatcher)
          .next()
          .takeEvery(GetBookmarksForUser.REQUEST, getBookmarkForUserWorker);
      });
    });

    describe('getBookmarkForUserWorker', () => {
      let action: GetBookmarksForUserRequest;
      beforeAll(() => {
        action = getBookmarksForUser(testUserId);
      });

      it('adds a bookmark', () => {
        return expectSaga(getBookmarkForUserWorker, action)
          .provide([
            [matchers.call.fn(getBkmrks), { bookmarks }],
          ])
          .put(getBookmarksForUserSuccess(bookmarks))
          .run();
      });

      it('handles request error', () => {
        return expectSaga(getBookmarkForUserWorker, action)
          .provide([
            [matchers.call.fn(getBkmrks), throwError(new Error())],
          ])
          .put(getBookmarksForUserFailure())
          .run();
      });
    });

    describe('removeBookmarkWatcher', () => {
      it('takes RemoveBookmark.REQUEST with removeBookmarkWorker', () => {
        testSaga(removeBookmarkWatcher)
          .next()
          .takeEvery(RemoveBookmark.REQUEST, removeBookmarkWorker);
      });
    });

    describe('removeBookmarkWorker', () => {
      let action: RemoveBookmarkRequest;
      beforeAll(() => {
        action = removeBookmark(testResourceKey, testResourceType);
      });

      it('removes a bookmark', () => {
        return expectSaga(removeBookmarkWorker, action)
          .provide([
            [matchers.call.fn(removeBkmrk), {}],
          ])
          .put(removeBookmarkSuccess(testResourceKey, testResourceType))
          .run();
      });

      it('handles request error', () => {
        return expectSaga(removeBookmarkWorker, action)
          .provide([
            [matchers.call.fn(removeBkmrk), throwError(new Error())],
          ])
          .put(removeBookmarkFailure())
          .run();
      });
    });
  });
});
