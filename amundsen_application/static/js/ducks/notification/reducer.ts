import { NotificationType, SendNotificationOptions } from 'interfaces'

import {
  ResetNotification, ResetNotificationRequest,
  SubmitNotification, SubmitNotificationRequest, SubmitNotificationResponse
} from './types';

/* ACTIONS */
export function submitNotification(recipients: Array<string>, sender: string, notificationType: NotificationType, options?: SendNotificationOptions): SubmitNotificationRequest {
  return {
    payload: {
        recipients,
        sender,
        notificationType,
        options
    },
    type: SubmitNotification.REQUEST,
  };
};
export function submitNotificationFailure(): SubmitNotificationResponse {
  return {
    type: SubmitNotification.FAILURE,
  };
};
export function submitNotificationSuccess(): SubmitNotificationResponse {
  return {
    type: SubmitNotification.SUCCESS,
  };
};

/* REDUCER */
export interface NotificationReducerState {};

const initialState: NotificationReducerState = {};

export default function reducer(state: NotificationReducerState = initialState, action): NotificationReducerState {
  switch (action.type) {
    case SubmitNotification.REQUEST:
      return {};
    case SubmitNotification.SUCCESS:
      return {};
    case SubmitNotification.FAILURE:
      return {};
    case SubmitNotification.REQUEST:
      return {};
    default:
      return state;
  }
};
