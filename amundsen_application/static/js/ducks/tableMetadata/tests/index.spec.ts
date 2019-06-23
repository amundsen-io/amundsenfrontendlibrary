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

  let columnIndex: number;
  let emptyPreviewData: PreviewData;
  let newDescription: string;
  let previewData: PreviewData;
  let queryParams: PreviewQueryParams;
  let testEpoch: number;
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

    columnIndex = 2;
    emptyPreviewData  = {
      columns: [],
      data: [],
      error_text: 'Test text',
    };
    newDescription = 'testVal';
    previewData = {
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
    queryParams = {
      database: 'testDb',
      schema: 'testSchema',
      tableName: 'testName',
    };
    testEpoch = 1545925769;
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
      expect(updateTableDescription(newDescription, mockSuccess, mockFailure)).toEqual({
        type: UpdateTableDescription.REQUEST,
        payload: {
          newValue: newDescription,
          onSuccess: mockSuccess,
          onFailure: mockFailure,
        }
      });
    });

    it('getColumnDescription - returns the action to get a column description given the index', () => {
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
      expect(updateColumnDescription(newDescription, columnIndex, mockSuccess, mockFailure)).toEqual({
        type: UpdateColumnDescription.REQUEST,
        payload: {
          columnIndex,
          newValue: newDescription,
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
      expect(getLastIndexedSuccess(testEpoch)).toEqual({
        type: GetLastIndexed.SUCCESS,
        payload: {
          lastIndexedEpoch: testEpoch
        }
      });
    });

    it('getPreviewData - returns the action to get the preview table data', () => {
      expect(getPreviewData(queryParams)).toEqual({
        type: GetPreviewData.REQUEST,
        payload: {
          queryParams
        }
      });
    });

    it('getPreviewDataFailure - returns the action to process failure', () => {
      expect(getPreviewDataFailure(emptyPreviewData, 500)).toEqual({
        type: GetPreviewData.FAILURE,
        payload: {
          data: emptyPreviewData,
          status: 500
        }
      });
    });

    it('getPreviewData - returns the action to process success', () => {
      expect(getPreviewDataSuccess(previewData, 200)).toEqual({
        type: GetPreviewData.SUCCESS,
        payload: {
          data: previewData,
          status: 200
        }
      });
    });
  });

/* TODO: Code involving nested reducers is not covered, will need more investigation */
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
      expect(reducer(testState, getPreviewDataSuccess(previewData, 200))).toEqual({
        ...testState,
        preview: {
          data: previewData,
          status: 200,
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
        testSaga(getTableDataWorker, getTableData(testKey, testIndex, testSource))
          .next()
          .call(metadataGetTableData, testKey, testIndex, testSource)
          .next({ data: expectedData, owners: expectedOwners, statusCode: expectedStatus, tags: expectedTags })
          .put(getTableDataSuccess(expectedData, expectedOwners, expectedStatus, expectedTags))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        testSaga(getTableDataWorker, getTableData(testKey))
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
      describe('executes flow for getting table description', () => {
        let sagaTest;
        beforeAll(() => {
          const mockNewTableData: TableMetadata = initialTableDataState;
          sagaTest = (action) => {
            return testSaga(getTableDescriptionWorker, action)
              .next()
              .select()
              .next(globalState)
              .call(metadataGetTableDescription, globalState.tableMetadata.tableData)
              .next(mockNewTableData)
              .put(getTableDescriptionSuccess(mockNewTableData))
          };
        });
        it('without success callback', () => {
          sagaTest(getTableDescription())
            .next()
            .isDone();
        });

        it('with success callback', () => {
          sagaTest(getTableDescription(mockSuccess, mockFailure))
            .next()
            .call(mockSuccess)
            .next()
            .isDone();
        });
      });

      describe('handles request error', () => {
        let sagaTest;
        beforeAll(() => {
          const mockNewTableData: TableMetadata = initialTableDataState;
          sagaTest = (action) => {
            return testSaga(getTableDescriptionWorker, action)
              .next()
              .select()
              .next(globalState)
              .throw(new Error())
              .put(getTableDescriptionFailure(globalState.tableMetadata.tableData))
          };
        });
        it('without failure callback', () => {
          sagaTest(getTableDescription())
            .next()
            .isDone();
        });

        it('with failure callback', () => {
          sagaTest(getTableDescription(mockSuccess, mockFailure))
            .next()
            .call(mockFailure)
            .next()
            .isDone();
        });
      });
    });

    describe('updateTableDescriptionWatcher', () => {
      it('takes every UpdateTableDescription.REQUEST with updateTableDescriptionWorker', () => {
        testSaga(updateTableDescriptionWatcher)
          .next()
          .takeEvery(UpdateTableDescription.REQUEST, updateTableDescriptionWorker);
      });
    });

    describe('updateTableDescriptionWorker', () => {
      describe('executes flow for updating table description', () => {
        let sagaTest;
        beforeAll(() => {
          sagaTest = (mockSuccess) => {
            return testSaga(updateTableDescriptionWorker, updateTableDescription(newDescription, mockSuccess, null))
              .next()
              .select()
              .next(globalState)
              .call(metadataUpdateTableDescription, newDescription, globalState.tableMetadata.tableData)
          };
        });
        it('without success callback', () => {
          sagaTest()
            .next()
            .isDone();
        });

        it('with success callback', () => {
          sagaTest(mockSuccess)
            .next()
            .call(mockSuccess)
            .next()
            .isDone();
        });
      });

      describe('handles request error', () => {
        let sagaTest;
        beforeAll(() => {
          sagaTest = (mockFailure) => {
            return testSaga(updateTableDescriptionWorker, updateTableDescription(newDescription, null, mockFailure))
              .next()
              .select()
              .next(globalState)
              .throw(new Error())
          };
        });
        it('without failure callback', () => {
          sagaTest()
            .next()
            .isDone();
        });

        it('with failure callback', () => {
          sagaTest(mockFailure)
            .call(mockFailure)
            .next()
            .isDone();
        });
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
      describe('executes flow for getting a table column description', () => {
        let sagaTest;
        beforeAll(() => {
          const mockNewTableData: TableMetadata = initialTableDataState;
          sagaTest = (action) => {
            return testSaga(getColumnDescriptionWorker, action)
              .next()
              .select()
              .next(globalState)
              .call(metadataGetColumnDescription, action.payload.columnIndex, globalState.tableMetadata.tableData)
              .next(mockNewTableData)
              .put(getColumnDescriptionSuccess(mockNewTableData))
          };
        });
        it('without success callback', () => {
          sagaTest(getColumnDescription(columnIndex))
            .next()
            .isDone();
        });

        it('with success callback', () => {
          sagaTest(getColumnDescription(columnIndex, mockSuccess, mockFailure))
            .next()
            .call(mockSuccess)
            .next()
            .isDone();
        });
      });

      describe('handles request error', () => {
        let sagaTest;
        beforeAll(() => {
          const mockNewTableData: TableMetadata = initialTableDataState;
          sagaTest = (action) => {
            return testSaga(getColumnDescriptionWorker, action)
              .next()
              .select()
              .next(globalState)
              .throw(new Error())
              .put(getColumnDescriptionFailure(globalState.tableMetadata.tableData))
          };
        });
        it('without failure callback', () => {
          sagaTest(getColumnDescription(columnIndex))
            .next()
            .isDone();
        });

        it('with failure callback', () => {
          sagaTest(getColumnDescription(columnIndex, mockSuccess, mockFailure))
            .next()
            .call(mockFailure)
            .next()
            .isDone();
        });
      });
    });

    describe('updateColumnDescriptionWatcher', () => {
      it('takes every UpdateColumnDescription.REQUEST with updateColumnDescriptionWorker', () => {
        testSaga(updateColumnDescriptionWatcher)
          .next()
          .takeEvery(UpdateColumnDescription.REQUEST, updateColumnDescriptionWorker);
      });
    });

    describe('updateColumnDescriptionWorker', () => {
      describe('executes flow for updating a table column description', () => {
        let sagaTest;
        beforeAll(() => {
          sagaTest = (mockSuccess) => {
            return testSaga(updateColumnDescriptionWorker, updateColumnDescription(newDescription, columnIndex, mockSuccess, null))
              .next()
              .select()
              .next(globalState)
              .call(metadataUpdateColumnDescription, newDescription, columnIndex, globalState.tableMetadata.tableData)
          };
        });
        it('without success callback', () => {
          sagaTest()
            .next()
            .isDone();
        });

        it('with success callback', () => {
          sagaTest(mockSuccess)
            .next()
            .call(mockSuccess)
            .next()
            .isDone();
        });
      });

      describe('handles request error', () => {
        let sagaTest;
        beforeAll(() => {
          sagaTest = (mockFailure) => {
            return testSaga(updateColumnDescriptionWorker, updateColumnDescription(newDescription, columnIndex, null, mockFailure))
              .next()
              .select()
              .next(globalState)
              .throw(new Error())
          };
        });
        it('without failure callback', () => {
          sagaTest()
            .next()
            .isDone();
        });

        it('with failure callback', () => {
          sagaTest(mockFailure)
            .call(mockFailure)
            .next()
            .isDone();
        });
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

    describe('getPreviewDataWorker', () => {
      it('executes flow for getting preview data', () => {
        const mockResponse = { data: previewData, status: 200 };
        testSaga(getPreviewDataWorker, getPreviewData(queryParams))
          .next()
          .call(metadataGetPreviewData, queryParams)
          .next(mockResponse)
          .put(getPreviewDataSuccess(previewData, 200))
          .next()
          .isDone();
      });

      it('handles request error', () => {
        const mockErrorResponse = { name: '', message: '', response: { data: previewData, status: 500 }};
        testSaga(getPreviewDataWorker, getPreviewData(queryParams))
          .next()
          .throw(mockErrorResponse)
          .put(getPreviewDataFailure(previewData, 500))
          .next()
          .isDone();
      });

      it('handles request error with response fallbacks', () => {
        const mockErrorResponse = { name: '', message: '' };
        testSaga(getPreviewDataWorker, getPreviewData(queryParams))
          .next()
          .throw(mockErrorResponse)
          .put(getPreviewDataFailure({}, null))
          .next()
          .isDone();
      });
    });
  });
});
