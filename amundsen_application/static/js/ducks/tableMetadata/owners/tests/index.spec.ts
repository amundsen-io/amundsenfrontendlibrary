import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { UpdateMethod, UpdateOwnerPayload, User } from 'interfaces';

import globalState from 'fixtures/globalState';

import { metadataUpdateTableOwner, metadataTableOwners } from '../../api/v0';
import reducer, {
  updateTableOwner, updateTableOwnerFailure, updateTableOwnerSuccess,
  initialOwnersState, TableOwnerReducerState
} from '../reducer';
import { getTableData, getTableDataFailure, getTableDataSuccess } from '../../reducer';
import { updateTableOwnerWorker, updateTableOwnerWatcher } from '../sagas';
import { GetTableData, UpdateTableOwner } from '../../types';

describe('tableMetadata:owners ducks', () => {
  let expectedOwners: {[id: string] : User};
  let updatePayload: UpdateOwnerPayload[];
  let mockSuccess;
  let mockFailure;
  beforeAll(() => {
    expectedOwners = {
      'testId': {display_name: 'test', profile_url: 'test.io'}
    };
    updatePayload = [{method: UpdateMethod.PUT, id: 'testId'}];
    mockSuccess = jest.fn();
    mockFailure = jest.fn();
  });

  describe('actions', () => {
    it('updateTableOwner - returns the action to update table owners', () => {
      expect(updateTableOwner(updatePayload, mockSuccess, mockFailure)).toEqual({
        type: UpdateTableOwner.REQUEST,
        payload: {
          updateArray: updatePayload,
          onSuccess: mockSuccess,
          onFailure: mockFailure,
        }
      });
    });

    it('updateTableOwnerFailure - returns the action to process failure', () => {
      expect(updateTableOwnerFailure(expectedOwners)).toEqual({
        type: UpdateTableOwner.FAILURE,
        payload: {
          owners: expectedOwners,
        }
      });
    });

    it('updateTableOwnerSuccess - returns the action to process success', () => {
      expect(updateTableOwnerSuccess(expectedOwners)).toEqual({
        type: UpdateTableOwner.SUCCESS,
        payload: {
          owners: expectedOwners
        }
      });
    });
  });

  describe('reducer', () => {
    let testState: TableOwnerReducerState;
    beforeAll(() => {
      testState = initialOwnersState;
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle UpdateTableOwner.REQUEST', () => {
      expect(reducer(testState, updateTableOwner(updatePayload, mockSuccess, mockFailure))).toEqual({
        ...testState,
        isLoading: true,
      });
    });

    it('should handle UpdateTableOwner.FAILURE', () => {
      expect(reducer(testState, updateTableOwnerFailure(expectedOwners))).toEqual({
        ...testState,
        isLoading: false,
        owners: expectedOwners,
      });
    });

    it('should handle UpdateTableOwner.SUCCESS', () => {
      expect(reducer(testState, updateTableOwnerSuccess(expectedOwners))).toEqual({
        ...testState,
        isLoading: false,
        owners: expectedOwners,
      });
    });

    it('should handle GetTableData.REQUEST', () => {
      expect(reducer(testState, getTableData('testKey'))).toEqual({
        ...testState,
        isLoading: true,
        owners: {},
      });
    });

    it('should handle GetTableData.FAILURE', () => {
      expect(reducer(testState, getTableDataFailure())).toEqual({
        ...testState,
        isLoading: false,
        owners: {},
      });
    });

    it('should handle GetTableData.SUCCESS', () => {
      const mockTableData = globalState.tableMetadata.tableData;
      expect(reducer(testState, getTableDataSuccess(mockTableData, expectedOwners, 200, []))).toEqual({
        ...testState,
        isLoading: false,
        owners: expectedOwners,
      });
    });
  });

  describe('sagas', () => {
    describe('updateTableOwnerWatcher', () => {
      it('takes every UpdateTableOwner.REQUEST with updateTableOwnerWorker', () => {
        testSaga(updateTableOwnerWatcher)
          .next()
          .takeEvery(UpdateTableOwner.REQUEST, updateTableOwnerWorker);
      });
    });

    /* TODO: These tests throw errors and warnings, more investigation needed
    describe('updateTableOwnerWorker', () => {
      it('executes flow for updating tags and returning up to date tag array', () => {
        testSaga(updateTableTagsWorker, updateTags(updatePayload))
          .next()
          .select()
          .next({tableMetadata: { tableData: {key: 'testKey'}}})
          .all(call(metadataUpdateTableTags, updatePayload, 'testKey'))
          .next()
          .call(metadataTableTags, 'testKey')
          .next(expectedTags)
          .put(updateTagsSuccess(expectedTags))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(updateTableOwnerWorker, updateTableOwner(updatePayload, mockSuccess, mockFailure))
          .next()
          .select()
          .next({
            tableMetadata: {
              tableData: {key: 'testKey'},
              tableOwners: { owners: expectedOwners },
            }
          })
          .throw(new Error())
          .put(updateTableOwnerFailure(expectedOwners))
          .next()
          .call(mockFailure)
          .next()
          .isDone();
      });
    });*/
  });
});
