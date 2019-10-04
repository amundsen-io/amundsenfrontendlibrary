import { testSaga } from 'redux-saga-test-plan';

import { NotificationType, RequestMetadataType, SendingState } from 'interfaces';

import * as API from '../api/v0';
import reducer, {
  submitNotification,
  submitNotificationFailure,
  submitNotificationSuccess,
  closeRequestDescriptionDialog,
  openRequestDescriptionDialog,
  NotificationReducerState,
} from '../reducer';
import {
  submitNotificationWatcher, submitNotificationWorker
} from '../sagas';
import {
  SubmitNotification, ToggleRequest
} from '../types';

const testRecipients = ['user1@test.com'];
const testSender = 'user2@test.com';
const testNotificationType = NotificationType.OWNER_ADDED;
const testOptions = {
  resource_name: 'testResource',
  resource_path: '/testResource',
  description_requested: false,
  fields_requested: false,
};

describe('notifications ducks', () => {
  describe('actions', () => {
    it('submitNotification - returns the action to submit a notification', () => {
      const action = submitNotification(testRecipients, testSender, testNotificationType, testOptions);
      const { payload } = action;
      expect(action.type).toBe(SubmitNotification.REQUEST);
      expect(payload.recipients).toBe(testRecipients);
      expect(payload.sender).toBe(testSender);
      expect(payload.notificationType).toBe(testNotificationType);
      expect(payload.options).toBe(testOptions);
    });

    it('submitNotificationFailure - returns the action to process failure', () => {
      const action = submitNotificationFailure();
      expect(action.type).toBe(SubmitNotification.FAILURE);
    });

    it('submitNotificationSuccess - returns the action to process success', () => {
      const action = submitNotificationSuccess();
      expect(action.type).toBe(SubmitNotification.SUCCESS);
    });

    it('closeRequestDescriptionDialog - returns the action to trigger the request description to close', () => {
      const action = closeRequestDescriptionDialog();
      expect(action.type).toBe(ToggleRequest.CLOSE);
    });

    it('openRequestDescriptionDialog - returns the action to trigger the request description to open', () => {
      const testType = RequestMetadataType.TABLE_DESCRIPTION;
      const action = openRequestDescriptionDialog(testType);
      const { payload, type } = action;
      expect(type).toBe(ToggleRequest.OPEN);
      expect(payload.requestMetadataType).toBe(testType);
      expect(payload.columnIndex).toBe(undefined);
    });

    it('openRequestDescriptionDialog w/ columnIndex - returns the action to trigger the request description to open', () => {
      const testType = RequestMetadataType.TABLE_DESCRIPTION;
      const testIndex = 2;
      const action = openRequestDescriptionDialog(testType, testIndex);
      const { payload, type } = action;
      expect(type).toBe(ToggleRequest.OPEN);
      expect(payload.requestMetadataType).toBe(testType);
      expect(payload.columnIndex).toBe(testIndex);
    });
  });

  describe('reducer', () => {
    let testState: NotificationReducerState;
    beforeAll(() => {
      testState = {
        requestIsOpen: true,
        sendState: SendingState.IDLE,
      };
    });
    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle ToggleRequest.OPEN without columnIndex', () => {
      expect(reducer(testState, openRequestDescriptionDialog(RequestMetadataType.TABLE_DESCRIPTION))).toEqual({
        requestMetadataType: RequestMetadataType.TABLE_DESCRIPTION,
        requestIsOpen: true,
        sendState: SendingState.IDLE,
      });
    });

    it('should handle ToggleRequest.OPEN with columnIndex', () => {
      expect(reducer(testState, openRequestDescriptionDialog(RequestMetadataType.TABLE_DESCRIPTION, 5))).toEqual({
        columnIndex: 5,
        requestMetadataType: RequestMetadataType.TABLE_DESCRIPTION,
        requestIsOpen: true,
        sendState: SendingState.IDLE,
      });
    });

    it('should handle ToggleRequest.CLOSE', () => {
      expect(reducer(testState, closeRequestDescriptionDialog())).toEqual({
        requestIsOpen: false,
        sendState: SendingState.IDLE,
      });
    });

    it('should handle SubmitNotification.FAILURE', () => {
      expect(reducer(testState, submitNotificationFailure())).toEqual({
        ...testState,
        sendState: SendingState.ERROR,
      });
    });

    it('should handle SubmitNotification.REQUEST', () => {
      const action = submitNotification(testRecipients, testSender, testNotificationType, testOptions);
      expect(reducer(testState, action)).toEqual({
        ...testState,
        requestIsOpen: false,
        sendState: SendingState.WAITING,
      });
    });

    it('should handle SubmitNotification.SUCCESS', () => {
      expect(reducer(testState, submitNotificationSuccess())).toEqual({
        ...testState,
        sendState: SendingState.COMPLETE,
      });
    });
  });

  describe('sagas', () => {
    describe('submitNotificationWatcher', () => {
      it('takes every SubmitNotification.REQUEST with submitNotificationWorker', () => {
        testSaga(submitNotificationWatcher)
          .next().takeEvery(SubmitNotification.REQUEST, submitNotificationWorker)
          .next().isDone();
      });
    });

    describe('submitNotificationWorker', () => {
      it('executes flow for submitting notification', () => {
        testSaga(submitNotificationWorker, submitNotification(testRecipients, testSender, testNotificationType, testOptions))
          .next().call(API.sendNotification, testRecipients, testSender, testNotificationType, testOptions)
          .next().put(submitNotificationSuccess())
          .next().isDone();
      });

      it('handles request error', () => {
        testSaga(submitNotificationWorker, null)
          .next().put(submitNotificationFailure())
          .next().isDone();
      });
    });
  });
});
