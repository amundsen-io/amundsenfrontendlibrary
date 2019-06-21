import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { PreviewData, PreviewQueryParams, TableMetadata, Tag, UpdateMethod, UpdateOwnerPayload, User } from 'interfaces';

import globalState from 'fixtures/globalState';

import {
  metadataGetLastIndexed,
  metadataGetPreviewData,
  metadataGetTableData,
  metadataGetColumnDescription,
  metadataGetTableDescription,
  metadataUpdateColumnDescription,
  metadataUpdateTableDescription,
} from '../api/v0';

import reducer, {
  getTableData, getTableDataFailure, getTableDataSuccess,
  getTableDescription, getTableDescriptionFailure, getTableDescriptionSuccess,
  updateTableDescription,
  getColumnDescription, getColumnDescriptionFailure, getColumnDescriptionSuccess,
  updateColumnDescription,
  getLastIndexed, getLastIndexedFailure, getLastIndexedSuccess,
  getPreviewData, getPreviewDataFailure, getPreviewDataSuccess,
  initialPreviewState, initialTableDataState, initialState, TableMetadataReducerState,
} from '../reducer';

import {
  getTableDataWatcher, getTableDataWorker,
  getTableDescriptionWatcher, getTableDescriptionWorker,
  updateTableDescriptionWatcher, updateTableDescriptionWorker,
  getColumnDescriptionWatcher, getColumnDescriptionWorker,
  updateColumnDescriptionWatcher, updateColumnDescriptionWorker,
  getLastIndexedWatcher, getLastIndexedWorker,
  getPreviewDataWatcher, getPreviewDataWorker,
} from '../sagas';

import {
  GetTableData,
  GetTableDescription,
  UpdateTableDescription,
  GetColumnDescription,
  UpdateColumnDescription,
  GetLastIndexed,
  GetPreviewData,
} from '../types';

describe('tableMetadata ducks', () => {
  let expectedData: TableMetadata;
  let expectedOwners: {[id: string] : User};
  let expectedTags: Tag[];
  let expectedStatus: number;
  let mockSuccess;
  let mockFailure;
  let updatePayload: UpdateOwnerPayload[];
  let testKey: string;
  let testIndex: string;
  let testSource: string;
  beforeAll(() => {
    expectedData = globalState.tableMetadata.tableData;
    expectedOwners = {
      'testId': {display_name: 'test', profile_url: 'test.io'}
    };
    expectedTags = [{tag_count: 2, tag_name: 'test'}, {tag_count: 1, tag_name: 'test2'}];
    expectedStatus = 200;

    mockSuccess = jest.fn().mockImplementation(() => {});
    mockFailure = jest.fn().mockImplementation(() => {});

    updatePayload = [{method: UpdateMethod.PUT, id: 'testId'}];

    testKey = 'tableKey';
    testIndex = '3';
    testSource = 'search';
  });

  describe('actions', () => {
    it('getTableData - returns the action to get table metadata', () => {
      expect(getTableData(testKey, testIndex, testSource)).toEqual({
        type: GetTableData.REQUEST,
        payload: {
          key: testKey,
          searchIndex: testIndex,
          source: testSource,
        }
      });
    });

    it('getTableDataFailure - returns the action to process failure', () => {
      expect(getTableDataFailure()).toEqual({
        type: GetTableData.FAILURE,
        payload: { data: initialTableDataState, owners: {}, statusCode: 500, tags: [] },
      });
    });

    it('getTableDataSuccess - returns the action to process success', () => {
      expect(getTableDataSuccess(expectedData, expectedOwners, expectedStatus, expectedTags)).toEqual({
        type: GetTableData.SUCCESS,
        payload: {
          data: expectedData,
          owners: expectedOwners,
          statusCode: expectedStatus,
          tags: expectedTags,
        },
      });
    });

    it('getTableDescription - returns the action to get the table description', () => {
      expect(getTableDescription(mockSuccess, mockFailure)).toEqual({
        type: GetTableDescription.REQUEST,
        payload: {
          onSuccess: mockSuccess,
          onFailure: mockFailure,
        }
      });
    });

    it('getTableDescription - returns the action to process failure', () => {
      expect(getTableDescriptionFailure(expectedData)).toEqual({
        type: GetTableDescription.FAILURE,
        payload: {
          tableMetadata: expectedData,
        },
      });
    });

    it('getTableDescription - returns the action to process success', () => {
      expect(getTableDescriptionSuccess(expectedData)).toEqual({
        type: GetTableDescription.SUCCESS,
        payload: {
          tableMetadata: expectedData,
        },
      });
    });

    it('updateTableDescription - returns the action to update the table description', () => {
      const newValue = 'testVal';
      expect(updateTableDescription(newValue, mockSuccess, mockFailure)).toEqual({
        type: UpdateTableDescription.REQUEST,
        payload: {
          newValue,
          onSuccess: mockSuccess,
          onFailure: mockFailure,
        }
      });
    });

    it('getColumnDescription - returns the action to get a column description given the index', () => {
      const columnIndex = 3;
      expect(getColumnDescription(columnIndex, mockSuccess, mockFailure)).toEqual({
        type: GetColumnDescription.REQUEST,
        payload: {
          columnIndex,
          onSuccess: mockSuccess,
          onFailure: mockFailure,
        }
      });
    });

    it('getColumnDescription - returns the action to process failure', () => {
      expect(getColumnDescriptionFailure(expectedData)).toEqual({
        type: GetColumnDescription.FAILURE,
        payload: {
          tableMetadata: expectedData,
        },
      });
    });

    it('getColumnDescription - returns the action to process success', () => {
      expect(getColumnDescriptionSuccess(expectedData)).toEqual({
        type: GetColumnDescription.SUCCESS,
        payload: {
          tableMetadata: expectedData,
        },
      });
    });

    it('updateColumnDescription - returns the action to update the table description', () => {
      const newValue = 'testVal';
      const columnIndex = 2;
      expect(updateColumnDescription(newValue, columnIndex, mockSuccess, mockFailure)).toEqual({
        type: UpdateColumnDescription.REQUEST,
        payload: {
          columnIndex,
          newValue,
          onSuccess: mockSuccess,
          onFailure: mockFailure,
        }
      });
    });

    it('getLastIndexed - returns the action to get the last indexed date of the table', () => {
      expect(getLastIndexed()).toEqual({
        type: GetLastIndexed.REQUEST,
      });
    });

    it('getLastIndexedFailure - returns the action to process failure', () => {
      expect(getLastIndexedFailure()).toEqual({
        type: GetLastIndexed.FAILURE,
      });
    });

    it('getLastIndexed - returns the action to process success', () => {
      const testEpoch = 1545925769;
      expect(getLastIndexedSuccess(testEpoch)).toEqual({
        type: GetLastIndexed.SUCCESS,
        payload: {
          lastIndexedEpoch: testEpoch
        }
      });
    });

    it('getPreviewData - returns the action to get the preview table data', () => {
      const queryParams: PreviewQueryParams = {
        database: 'testDb',
        schema: 'testSchema',
        tableName: 'testName',
      };
      expect(getPreviewData(queryParams)).toEqual({
        type: GetPreviewData.REQUEST,
        payload: {
          queryParams
        }
      });
    });

    it('getPreviewDataFailure - returns the action to process failure', () => {
      const data: PreviewData = {
        columns: [],
        data: [],
        error_text: 'Test text',
      };
      const status = 500;
      expect(getPreviewDataFailure(data, status)).toEqual({
        type: GetPreviewData.FAILURE,
        payload: {
          data,
          status,
        }
      });
    });

    it('getPreviewData - returns the action to process success', () => {
      const data: PreviewData = {
        columns: [
          { column_name: 'col_id', column_type:'BIGINT'},
          { column_name: 'col_1', column_type: 'VARCHAR'},
        ],
        data: [
          { id: '1' },
          { id: '2' },
          { id: '3' },
        ],
        error_text: 'Test text',
      }
      const status = 200;
      expect(getPreviewDataSuccess(data, status)).toEqual({
        type: GetPreviewData.SUCCESS,
        payload: {
          data,
          status,
        }
      });
    });
  });

/* TODO: Unsure how to test code involving nested reducers, will need more investigation */
describe('reducer', () => {
    let testState: TableMetadataReducerState;
    beforeAll(() => {
      testState = initialState;
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle GetTableDescription.FAILURE', () => {
      expect(reducer(testState, getTableDescriptionFailure(expectedData))).toEqual({
        ...testState,
        tableData: expectedData
      });
    });

    it('should handle GetTableDescription.SUCCESS', () => {
      expect(reducer(testState, getTableDescriptionSuccess(expectedData))).toEqual({
        ...testState,
        tableData: expectedData
      });
    });

    it('should handle GetColumnDescription.FAILURE', () => {
      expect(reducer(testState, getColumnDescriptionFailure(expectedData))).toEqual({
        ...testState,
        tableData: expectedData
      });
    });

    it('should handle GetColumnDescription.SUCCESS', () => {
      expect(reducer(testState, getColumnDescriptionSuccess(expectedData))).toEqual({
        ...testState,
        tableData: expectedData
      });
    });

    it('should handle GetLastIndexed.FAILURE', () => {
      expect(reducer(testState, getLastIndexedFailure())).toEqual({
        ...testState,
        lastIndexed: null,
      });
    });

    it('should handle GetLastIndexed.SUCCESS', () => {
      const testEpoch = 1545925769;
      expect(reducer(testState, getLastIndexedSuccess(testEpoch))).toEqual({
        ...testState,
        lastIndexed: testEpoch,
      });
    });

    it('should handle GetPreviewData.FAILURE', () => {
      expect(reducer(testState, getPreviewDataFailure({}, 500))).toEqual({
        ...testState,
        preview: initialPreviewState,
      });
    });

    it('should handle GetPreviewData.SUCCESS', () => {
      const previewData: PreviewData = {
        columns: [
          { column_name: 'col_id', column_type:'BIGINT'},
          { column_name: 'col_1', column_type: 'VARCHAR'},
        ],
        data: [
          { id: '1' },
          { id: '2' },
          { id: '3' },
        ],
        error_text: 'Test text',
      }
      const status = 200;
      expect(reducer(testState, getPreviewDataSuccess(previewData, status))).toEqual({
        ...testState,
        preview: {
          status,
          data: previewData,
        }
      });
    });
  });

  describe('sagas', () => {
    describe('getTableDataWatcher', () => {
      it('takes every GetTableData.REQUEST with getTableDataWorker', () => {
        testSaga(getTableDataWatcher)
          .next()
          .takeEvery(GetTableData.REQUEST, getTableDataWorker);
      });
    });

    describe('getTableDataWorker', () => {
      it('executes flow for getting table data', () => {
        const key = 'testKey';
        const searchIndex = '1';
        const source = 'testSource'
        testSaga(getTableDataWorker, getTableData(key, searchIndex, source))
          .next()
          .call(metadataGetTableData, key, searchIndex, source)
          .next({ data: expectedData, owners: expectedOwners, statusCode: expectedStatus, tags: expectedTags })
          .put(getTableDataSuccess(expectedData, expectedOwners, expectedStatus, expectedTags))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getTableDataWorker, getTableData('testKey'))
          .next()
          .throw(new Error())
          .put(getTableDataFailure())
          .next()
          .isDone();
      });
    });

    describe('getTableDescriptionWatcher', () => {
      it('takes every GetTableDescription.REQUEST with getTableDescriptionWorker', () => {
        testSaga(getTableDescriptionWatcher)
          .next()
          .takeEvery(GetTableDescription.REQUEST, getTableDescriptionWorker);
      });
    });

    describe('getTableDescriptionWorker', () => {
      it('executes flow for getting table description', () => {
        const mockNewTableData = initialTableDataState;
        testSaga(getTableDescriptionWorker, getTableDescription(mockSuccess, mockFailure))
          .next()
          .select()
          .next(globalState)
          .call(metadataGetTableDescription, globalState.tableMetadata.tableData)
          .next(mockNewTableData)
          .put(getTableDescriptionSuccess(mockNewTableData))
          .next()
          .call(mockSuccess)
          .next()
          .isDone();
      });

      /* TODO: This test fails, needs more investigation
      it('handles request error', () => {
        testSaga(getTableDescriptionWorker, getTableDescription(mockSuccess, mockFailure))
          .next()
          .select()
          .next(globalState)
          .throw(new Error())
          .put(getTableDescriptionFailure(globalState.tableMetadata.tableData))
          .next()
          .call(mockFailure)
          .next()
          .isDone();
      });*/
    });

    describe('updateTableDescriptionWatcher', () => {
      it('takes every UpdateTableDescription.REQUEST with updateTableDescriptionWorker', () => {
        testSaga(updateTableDescriptionWatcher)
          .next()
          .takeEvery(UpdateTableDescription.REQUEST, updateTableDescriptionWorker);
      });
    });

    describe('updateTableDescriptionWorker', () => {
      it('executes flow for update table description', () => {
        const mockValue = 'I am a description';
        testSaga(updateTableDescriptionWorker, updateTableDescription(mockValue, mockSuccess, mockFailure))
          .next()
          .select()
          .next(globalState)
          .call(metadataUpdateTableDescription, mockValue, globalState.tableMetadata.tableData)
          .next()
          .call(mockSuccess)
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(updateTableDescriptionWorker, updateTableDescription('I am a description', mockSuccess, mockFailure))
          .next()
          .select()
          .next(globalState)
          .throw(new Error())
          .call(mockFailure)
          .next()
          .isDone();
      });
    });

    describe('getColumnDescriptionWatcher', () => {
      it('takes every GetColumnDescription.REQUEST with getColumnDescriptionWorker', () => {
        testSaga(getColumnDescriptionWatcher)
          .next()
          .takeEvery(GetColumnDescription.REQUEST, getColumnDescriptionWorker);
      });
    });

    describe('getColumnDescriptionWorker', () => {
      it('executes flow for getting a table column description', () => {
        const columnIndex = 2;
        const mockNewTableData: TableMetadata = initialTableDataState;
        testSaga(getColumnDescriptionWorker, getColumnDescription(columnIndex, mockSuccess, mockFailure))
          .next()
          .select()
          .next(globalState)
          .call(metadataGetColumnDescription, columnIndex, globalState.tableMetadata.tableData)
          .next(mockNewTableData)
          .put(getColumnDescriptionSuccess(mockNewTableData))
          .next()
          .call(mockSuccess)
          .next()
          .isDone();
      });

      /* TODO: This test fails, needs more investigation
      it('handles request error', () => {
        const mockState = globalState;
        testSaga(getColumnDescriptionWorker, getColumnDescription(2, mockSuccess, mockFailure))
          .next()
          .select()
          .next(mockState)
          .throw(new Error())
          .put(getColumnDescriptionFailure(mockState.tableMetadata.tableData))
          .next()
          .call(mockFailure)
          .next()
          .isDone();
      });*/
    });

    describe('updateColumnDescriptionWatcher', () => {
      it('takes every UpdateColumnDescription.REQUEST with updateColumnDescriptionWorker', () => {
        testSaga(updateColumnDescriptionWatcher)
          .next()
          .takeEvery(UpdateColumnDescription.REQUEST, updateColumnDescriptionWorker);
      });
    });

    describe('updateColumnDescriptionWorker', () => {
      it('executes flow for updating a table column description', () => {
        const columnIndex = 2;
        const mockValue = 'I am a description';
        testSaga(updateColumnDescriptionWorker, updateColumnDescription(mockValue, columnIndex, mockSuccess, mockFailure))
          .next()
          .select()
          .next(globalState)
          .call(metadataUpdateColumnDescription, mockValue, columnIndex, globalState.tableMetadata.tableData)
          .next()
          .call(mockSuccess)
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(updateColumnDescriptionWorker, updateColumnDescription('I am a description', 2, mockSuccess, mockFailure))
          .next()
          .select()
          .next(globalState)
          .throw(new Error())
          .call(mockFailure)
          .next()
          .isDone();
      });
    });

    describe('getLastIndexedWatcher', () => {
      it('takes every GetLastIndexed.REQUEST with getLastIndexedWorker', () => {
        testSaga(getLastIndexedWatcher)
          .next()
          .takeEvery(GetLastIndexed.REQUEST, getLastIndexedWorker);
      });
    });

    describe('getLastIndexedWorker', () => {
      it('executes flow for getting last indexed value', () => {
        const testEpoch = 1545925769;
        testSaga(getLastIndexedWorker, getLastIndexed())
          .next()
          .call(metadataGetLastIndexed)
          .next(testEpoch)
          .put(getLastIndexedSuccess(testEpoch))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getLastIndexedWorker, getLastIndexed())
          .next()
          .throw(new Error())
          .put(getLastIndexedFailure())
          .next()
          .isDone();
      });
    });

    describe('getPreviewDataWatcher', () => {
      it('takes every GetPreviewData.REQUEST with getPreviewDataWorker', () => {
        testSaga(getPreviewDataWatcher)
          .next()
          .takeEvery(GetPreviewData.REQUEST, getPreviewDataWorker);
      });
    });

    /*describe('getPreviewDataWorker', () => {
      it('executes flow for getting last indexed value', () => {
        const testEpoch = 1545925769;
        testSaga(getLastIndexedWorker, getLastIndexed())
          .next()
          .call(metadataGetLastIndexed)
          .next(testEpoch)
          .put(getLastIndexedSuccess(testEpoch))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getPreviewWorker, getPreviewData())
          .next()
          .throw(new Error())
          .put(getLastIndexedFailure())
          .next()
          .isDone();
      });
    });*/
  });
});
