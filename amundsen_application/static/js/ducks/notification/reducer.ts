import { NotificationType, SendNotificationOptions } from 'interfaces'

import {
  ToggleRequest, ToggleRequestAction, SubmitNotification, SubmitNotificationRequest, SubmitNotificationResponse,
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

export function toggleRequest(): ToggleRequestAction {
  return {
    type: ToggleRequest.TOGGLE,
  };
};

/* REDUCER */
export interface NotificationReducerState {
  requestIsOpen: boolean,
};

const initialState: NotificationReducerState = {
  requestIsOpen: false,
};

export default function reducer(state: NotificationReducerState = initialState, action): NotificationReducerState {
  switch (action.type) {
    case ToggleRequest.TOGGLE:
      return {
        requestIsOpen: !state.requestIsOpen,
      }
    case SubmitNotification.REQUEST:
      return state;
    case SubmitNotification.SUCCESS:
      return {
        requestIsOpen: false,
      };
    case SubmitNotification.FAILURE:
      return {
        requestIsOpen: false,
      };
    default:
      return state;
  }
};
