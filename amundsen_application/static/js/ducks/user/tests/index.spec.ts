import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { LoggedInUser, PeopleUser, Resource } from 'interfaces';

import globalState from 'fixtures/globalState';

import { loggedInUser, userById, userOwn, userRead } from '../api/v0';
import reducer, {
  getLoggedInUser, getLoggedInUserFailure, getLoggedInUserSuccess,
  getUser, getUserFailure, getUserSuccess,
  getUserOwn, getUserOwnFailure, getUserOwnSuccess,
  getUserRead, getUserReadFailure, getUserReadSuccess,
  defaultUser, initialState, UserReducerState,
} from '../reducer';
import {
  getLoggedInUserWorker, getLoggedInUserWatcher,
  getUserWorker, getUserWatcher,
  getUserOwnWorker, getUserOwnWatcher,
  getUserReadWorker, getUserReadWatcher,
} from '../sagas';
import {
  GetLoggedInUser,
  GetUser,
  GetUserOwn,
  GetUserRead,
} from '../types';

describe('user ducks', () => {
  let currentUser: LoggedInUser;
  let otherUser: {
    own: Resource[],
    read: Resource[],
    user: PeopleUser,
  };
  let userId: string;
  beforeAll(() => {
    currentUser = globalState.user.loggedInUser;
    otherUser = globalState.user.profile;
    userId = 'testId';
  });

  describe('actions', () => {
    it('getLoggedInUser - returns the action to get the data for the current user', () => {
      expect(getLoggedInUser()).toEqual({
        type: GetLoggedInUser.REQUEST,
      });
    });

    it('getLoggedInUserSuccess - returns the action to process the success', () => {
      expect(getLoggedInUserSuccess(currentUser)).toEqual({
        type: GetLoggedInUser.SUCCESS,
        payload: {
          user: currentUser,
        },
      });
    });

    it('getLoggedInUserFailure - returns the action to process the failure', () => {
      expect(getLoggedInUserFailure()).toEqual({
        type: GetLoggedInUser.FAILURE,
      });
    });

    it('getUser - returns the action to get the data for a user given an id', () => {
      expect(getUser(userId)).toEqual({
        type: GetUser.REQUEST,
        payload: {
          userId
        }
      });
    });

    it('getUserSuccess - returns the action to process the success', () => {
      expect(getUserSuccess(otherUser.user)).toEqual({
        type: GetUser.SUCCESS,
        payload: {
          user: otherUser.user,
        },
      });
    });

    it('getUserFailure - returns the action to process the failure', () => {
      expect(getUserFailure()).toEqual({
        type: GetUser.FAILURE,
      });
    });

    it('getUserOwn - returns the action to get the owned resources for a user given an id', () => {
      expect(getUserOwn(userId)).toEqual({
        type: GetUserOwn.REQUEST,
        payload: {
          userId
        }
      });
    });

    it('getUserOwnSuccess - returns the action to process the success', () => {
      expect(getUserOwnSuccess(otherUser.own)).toEqual({
        type: GetUserOwn.SUCCESS,
        payload: {
          own: otherUser.own,
        },
      });
    });

    it('getUserOwnFailure - returns the action to process the failure', () => {
      expect(getUserOwnFailure()).toEqual({
        type: GetUserOwn.FAILURE,
      });
    });

    it('getUserRead - returns the action to get the frequently used resources for a user given an id', () => {
      expect(getUserRead(userId)).toEqual({
        type: GetUserRead.REQUEST,
        payload: {
          userId
        }
      });
    });

    it('getUserReadSuccess - returns the action to process the success', () => {
      expect(getUserReadSuccess(otherUser.read)).toEqual({
        type: GetUserRead.SUCCESS,
        payload: {
          read: otherUser.read,
        },
      });
    });

    it('getUserReadFailure - returns the action to process the failure', () => {
      expect(getUserReadFailure()).toEqual({
        type: GetUserRead.FAILURE,
      });
    });
  });

  describe('reducer', () => {
    let testState: UserReducerState;
    beforeAll(() => {
      testState = initialState;
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle GetLoggedInUser.SUCCESS', () => {
      expect(reducer(testState, getLoggedInUserSuccess(currentUser))).toEqual({
        ...testState,
        loggedInUser: currentUser,
      });
    });

    it('should handle GetUser.REQUEST', () => {
      expect(reducer(testState, getUser(userId))).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          user: defaultUser,
        },
      });
    });

    it('should handle GetUser.FAILURE', () => {
      expect(reducer(testState, getUserFailure())).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          user: defaultUser,
        },
      });
    });

    it('should handle GetUser.SUCCESS', () => {
      expect(reducer(testState, getUserSuccess(otherUser.user))).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          user: otherUser.user,
        },
      });
    });

    it('should handle GetUserOwn.REQUEST', () => {
      expect(reducer(testState, getUserOwn(userId))).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          own: [],
        },
      });
    });

    it('should handle GetUserOwn.FAILURE', () => {
      expect(reducer(testState, getUserOwnFailure())).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          own: [],
        },
      });
    });

    it('should handle GetUserOwn.SUCCESS', () => {
      expect(reducer(testState, getUserOwnSuccess(otherUser.own))).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          own: otherUser.own,
        },
      });
    });

    it('should handle GetUserRead.REQUEST', () => {
      expect(reducer(testState, getUserRead(userId))).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          read: [],
        },
      });
    });

    it('should handle GetUserRead.FAILURE', () => {
      expect(reducer(testState, getUserReadFailure())).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          read: [],
        },
      });
    });

    it('should handle GetUserRead.SUCCESS', () => {
      expect(reducer(testState, getUserReadSuccess(otherUser.read))).toEqual({
        ...testState,
        profile: {
          ...testState.profile,
          read: otherUser.read,
        },
      });
    });
  });

  describe('sagas', () => {
    describe('getLoggedInUserWatcher', () => {
      it('takes every GetLoggedInUser.REQUEST with getLoggedInUserWorker', () => {
        testSaga(getLoggedInUserWatcher)
          .next()
          .takeEvery(GetLoggedInUser.REQUEST, getLoggedInUserWorker);
      });
    });

    describe('getLoggedInUserWorker', () => {
      it('executes flow for returning the currentUser', () => {
        testSaga(getLoggedInUserWorker, getLoggedInUser())
          .next()
          .call(loggedInUser)
          .next(currentUser)
          .put(getLoggedInUserSuccess(currentUser))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getLoggedInUserWorker, getLoggedInUser())
          .next()
          .throw(new Error())
          .put(getLoggedInUserFailure())
          .next()
          .isDone();
      });
    });

    describe('getUserWatcher', () => {
      it('takes every GetUser.REQUEST with getUserWorker', () => {
        testSaga(getUserWatcher)
          .next()
          .takeEvery(GetUser.REQUEST, getUserWorker);
      });
    });

    describe('getUserWorker', () => {
      it('executes flow for returning a user given an id', () => {
        testSaga(getUserWorker, getUser(userId))
          .next()
          .call(userById, userId)
          .next(otherUser.user)
          .put(getUserSuccess(otherUser.user))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getUserWorker, getUser(userId))
          .next()
          .throw(new Error())
          .put(getUserFailure())
          .next()
          .isDone();
      });
    });

    describe('getUserOwnWatcher', () => {
      it('takes every GetUserOwn.REQUEST with getUserOwnWorker', () => {
        testSaga(getUserOwnWatcher)
          .next()
          .takeEvery(GetUserOwn.REQUEST, getUserOwnWorker);
      });
    });

    describe('getUserOwnWorker', () => {
      it('executes flow for returning a users owned resources given an id', () => {
        testSaga(getUserOwnWorker, getUserOwn(userId))
          .next()
          .call(userOwn, userId)
          .next(otherUser)
          .put(getUserOwnSuccess(otherUser.own))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getUserOwnWorker, getUserOwn(userId))
          .next()
          .throw(new Error())
          .put(getUserOwnFailure())
          .next()
          .isDone();
      });
    });

    describe('getUserReadWatcher', () => {
      it('takes every GetUserRead.REQUEST with getUserReadWorker', () => {
        testSaga(getUserReadWatcher)
          .next()
          .takeEvery(GetUserRead.REQUEST, getUserReadWorker);
      });
    });

    describe('getUserReadWorker', () => {
      it('executes flow for returning a users frequently used resources given an id', () => {
        testSaga(getUserReadWorker, getUserRead(userId))
          .next()
          .call(userRead, userId)
          .next(otherUser)
          .put(getUserReadSuccess(otherUser.read))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getUserReadWorker, getUserRead(userId))
          .next()
          .throw(new Error())
          .put(getUserReadFailure())
          .next()
          .isDone();
      });
    });
  });
});
