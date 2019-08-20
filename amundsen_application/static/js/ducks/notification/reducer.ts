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

export function closeRequestDescriptionDialog(): ToggleRequestAction {
  return {
    type: ToggleRequest.CLOSE,
  };
};

export function openRequestDescriptionDialog(): ToggleRequestAction {
  return {
    type: ToggleRequest.OPEN,
  }
}

/* REDUCER */
export interface NotificationReducerState {
  requestIsOpen: boolean,
};

const initialState: NotificationReducerState = {
  requestIsOpen: false,
};

export default function reducer(state: NotificationReducerState = initialState, action): NotificationReducerState {
  switch (action.type) {
    case ToggleRequest.OPEN:
      return {
        requestIsOpen: true,
      }
    case ToggleRequest.CLOSE:
      return {
        requestIsOpen: false,
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
