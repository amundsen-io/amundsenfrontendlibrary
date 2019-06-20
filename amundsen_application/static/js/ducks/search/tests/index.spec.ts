import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { ResourceType } from 'interfaces';

import globalState from 'fixtures/globalState';

import { searchAll as srchAll, searchResource as srchResource } from '../api/v0';
import reducer, {
  searchAll, searchAllSuccess, searchAllFailure,
  searchResource, searchResourceSuccess, searchResourceFailure,
  searchReset,
  initialState, SearchReducerState,
} from '../reducer';
import {
  searchAllWatcher, searchAllWorker,
  searchResourceWatcher, searchResourceWorker
} from '../sagas';
import {
  SearchAll, SearchAllRequest, SearchAllResponse,
  SearchResource, SearchResourceRequest, SearchResourceResponse,
  SearchResponsePayload,
} from '../types';

describe('search ducks', () => {
  let expectedSearchResults: SearchResponsePayload;
  beforeAll(() => {
    expectedSearchResults = globalState.search;
  });

  describe('actions', () => {
    it('searchAll - returns the action to search all resources', () => {
      const term = 'test';
      const options = {};
      expect(searchAll(term, options)).toEqual({
        payload: {
          options,
          term,
        },
        type: SearchAll.REQUEST,
      });
    });

    it('searchAllSuccess - returns the action to process the success', () => {
      expect(searchAllSuccess(expectedSearchResults)).toEqual({
        type: SearchAll.SUCCESS,
        payload: expectedSearchResults,
      });
    });

    it('searchAllFailure - returns the action to process the failure', () => {
      expect(searchAllFailure()).toEqual({
        type: SearchAll.FAILURE,
      });
    });

    it('searchResource - returns the action to search all resources', () => {
      const pageIndex = 0;
      const resource = ResourceType.table;
      const term = 'test';
      expect(searchResource(resource, term, pageIndex)).toEqual({
        payload: {
          pageIndex,
          term,
          resource,
        },
        type: SearchResource.REQUEST,
      });
    });

    it('searchResourceSuccess - returns the action to process the success', () => {
      expect(searchResourceSuccess(expectedSearchResults)).toEqual({
        type: SearchResource.SUCCESS,
        payload: expectedSearchResults,
      });
    });

    it('searchResourceFailure - returns the action to process the failure', () => {
      expect(searchResourceFailure()).toEqual({
        type: SearchResource.FAILURE,
      });
    });

    it('searchReset - returns the action to reset search state', () => {
      expect(searchReset()).toEqual({
        type: SearchAll.RESET,
      });
    });
  });

  describe('reducer', () => {
    let testState: SearchReducerState;
    beforeAll(() => {
      testState = initialState;
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle SearchAll.REQUEST', () => {
      const term = 'testSearch';
      const options = {};
      expect(reducer(testState, searchAll(term, options))).toEqual({
        ...testState,
        search_term: term,
        isLoading: true,
      });
    });

    it('should handle SearchAll.SUCCESS', () => {
      expect(reducer(testState, searchAllSuccess(expectedSearchResults))).toEqual({
        ...initialState,
        ...expectedSearchResults,
        isLoading: false,
      });
    });

    it('should handle SearchAll.FAILURE', () => {
      expect(reducer(testState, searchAllFailure())).toEqual({
        ...initialState,
        isLoading: false,
      });
    });

    it('should handle SearchAll.RESET', () => {
      expect(reducer(testState, searchReset())).toEqual(initialState);
    });

    it('should handle SearchResource.REQUEST', () => {
      expect(reducer(testState, searchResource(ResourceType.table, 'test', 0))).toEqual({
        ...initialState,
        isLoading: true,
      });
    });

    it('should handle SearchResource.SUCCESS', () => {
      expect(reducer(testState, searchResourceSuccess(expectedSearchResults))).toEqual({
        ...initialState,
        ...expectedSearchResults,
        isLoading: false,
      });
    });

    it('should handle SearchResource.FAILURE', () => {
      expect(reducer(testState, searchResourceFailure())).toEqual({
        ...initialState,
        isLoading: false,
      });
    });
  });

  describe('sagas', () => {
    describe('searchAllWatcher', () => {
      it('takes every SearchAll.REQUEST with searchAllWorker', () => {
        testSaga(searchAllWatcher)
          .next()
          .takeEvery(SearchAll.REQUEST, searchAllWorker);
      });
    });

    describe('searchAllWorker', () => {
      it('executes flow for returning search results', () => {
        const term = 'testSearch';
        const options = {};
        testSaga(searchAllWorker, searchAll(term, options))
          .next()
          .call(srchAll, options, term)
          .next(expectedSearchResults)
          .put(searchAllSuccess(expectedSearchResults))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(searchAllWorker, searchAll('test', {}))
          .next()
          .throw(new Error())
          .put(searchAllFailure())
          .next()
          .isDone();
      });
    });

    describe('searchResourceWatcher', () => {
      it('takes every SearchResource.REQUEST with searchResourceWorker', () => {
        testSaga(searchResourceWatcher)
          .next()
          .takeEvery(SearchResource.REQUEST, searchResourceWorker);
      });
    });

    describe('searchResourceWorker', () => {
      it('executes flow for returning search results', () => {
        const pageIndex = 0;
        const resource = ResourceType.table;
        const term = 'test';
        testSaga(searchResourceWorker, searchResource(resource, term, pageIndex))
          .next()
          .call(srchResource, pageIndex, resource, term)
          .next(expectedSearchResults)
          .put(searchResourceSuccess(expectedSearchResults))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(searchResourceWorker, searchResource(ResourceType.table, 'test', 0))
          .next()
          .throw(new Error())
          .put(searchResourceFailure())
          .next()
          .isDone();
      });
    });
  });
});
