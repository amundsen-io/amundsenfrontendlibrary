import { testSaga } from 'redux-saga-test-plan';

import {
  GetDashboardPreview
} from '../types';

import {
  getDashboardPreview,
  setDashboardPreview
} from '../reducer';

import { errorPreviewResponse, successPreviewResponse } from 'fixtures/dashboard/preview';

import * as API from '../api/v0';
import * as Sagas from '../sagas';

describe('dashboard sagas', () => {
  describe('getDashboardPreviewWatcher', () => {
    it('takes GetDashboardPreview.REQUEST with getDashboardWorker', () => {
      testSaga(Sagas.getDashboardPreviewWatcher)
        .next().takeEvery(GetDashboardPreview.REQUEST, Sagas.getDashboardPreviewWorker)
        .next().isDone();
    });
  });

  describe('getDashboardPreviewWorker', () => {
    it('handles success payload', () => {
      const testUri = 'someUri';
      const action = getDashboardPreview({ uri: testUri });
      testSaga(Sagas.getDashboardPreviewWorker, action)
        .next().call(API.getDashboardPreview, testUri)
        .next(successPreviewResponse).put(setDashboardPreview(successPreviewResponse))
        .next().isDone();
    });

    it('handles request error', () => {
      const testUri = 'someUri';
      const action = getDashboardPreview({ uri: testUri });
      testSaga(Sagas.getDashboardPreviewWorker, action)
        .next().call(API.getDashboardPreview, testUri)
        // @ts-ignore: TypeScript wants trhe mocked error response to match the Error object
        .throw(errorPreviewResponse).put(setDashboardPreview(errorPreviewResponse))
        .next().isDone();
    });
  });
});
