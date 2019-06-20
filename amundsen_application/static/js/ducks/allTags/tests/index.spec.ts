import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { metadataAllTags } from '../api/v0';
import reducer, {
  getAllTags, getAllTagsFailure, getAllTagsSuccess,
  initialState, AllTagsReducerState
} from '../reducer';
import { getAllTagsWatcher, getAllTagsWorker } from '../sagas';
import { GetAllTags } from '../types';

describe('allTags ducks', () => {
  describe('actions', () => {
    it('getAllTags - returns the action to get all tags', () => {
      expect(getAllTags()).toEqual({ type: GetAllTags.REQUEST });
    });

    it('getAllTagsFailure - returns the action to process failure', () => {
      expect(getAllTagsFailure()).toEqual({
        type: GetAllTags.FAILURE,
        payload: {
          tags: [],
        },
      });
    });

    it('getAllTagsSuccess - returns the action to process success', () => {
      const expectedTags = [{tag_count: 2, tag_name: 'test'}, {tag_count: 1, tag_name: 'test2'}];
      expect(getAllTagsSuccess(expectedTags)).toEqual({
        type: GetAllTags.SUCCESS,
        payload: {
          tags: expectedTags,
        }
      });
    });
  });

  describe('reducer', () => {
    let testState: AllTagsReducerState;
    beforeAll(() => {
      testState = {
        allTags: [],
        isLoading: true,
      };
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle GetAllTags.REQUEST', () => {
      expect(reducer(testState, getAllTags())).toEqual({
        allTags: [],
        isLoading: true,
      });
    });

    it('should handle GetAllTags.SUCCESS', () => {
      const expectedTags = [{tag_count: 2, tag_name: 'test'}, {tag_count: 1, tag_name: 'test2'}];
      expect(reducer(testState, getAllTagsSuccess(expectedTags))).toEqual({
        allTags: expectedTags,
        isLoading: false,
      });
    });

    it('should return the initialState if GetAllTags.FAILURE', () => {
      expect(reducer(testState, getAllTagsFailure())).toEqual(initialState);
    });
  });

  describe('sagas', () => {
    describe('getAllTagsWatcher', () => {
      it('takes GetAllTags.REQUEST with getAllTagsWorker', () => {
        testSaga(getAllTagsWatcher)
          .next()
          .takeEvery(GetAllTags.REQUEST, getAllTagsWorker);
      });
    });

    describe('getAllTagsWorker', () => {
      it('gets allTags', () => {
        const mockTags = [{tag_count: 2, tag_name: 'test'}, {tag_count: 1, tag_name: 'test2'}];
        return expectSaga(getAllTagsWorker)
          .provide([
            [matchers.call.fn(metadataAllTags), mockTags],
          ])
          .put(getAllTagsSuccess(mockTags))
          .run();
      });

      it('handles request error', () => {
        return expectSaga(getAllTagsWorker)
          .provide([
            [matchers.call.fn(metadataAllTags), throwError(new Error())],
          ])
          .put(getAllTagsFailure())
          .run();
      });
    });
  });
});
