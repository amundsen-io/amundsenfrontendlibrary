import { NotificationType, SendNotificationOptions, SendingState } from 'interfaces'

import {
  SubmitNotification,
  SubmitNotificationRequest,
  SubmitNotificationResponse,
  ToggleRequest,
  ToggleRequestAction,
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
    payload: {
      checkedInputs: [],
    }
  };
};

export function openRequestDescriptionDialog(checkedInputs?: string[]): ToggleRequestAction {
  checkedInputs = checkedInputs || [];
  return {
    type: ToggleRequest.OPEN,
    payload: {
      checkedInputs
    }
  }
}

/* REDUCER */
export interface NotificationReducerState {
  checkedInputs: string[],
  requestIsOpen: boolean,
  sendState: SendingState,
};

const initialState: NotificationReducerState = {
  checkedInputs: [],
  requestIsOpen: false,
  sendState: SendingState.IDLE,
};

export default function reducer(state: NotificationReducerState = initialState, action): NotificationReducerState {
  switch (action.type) {
    case SubmitNotification.FAILURE:
      return {
        ...state,
        sendState: SendingState.ERROR,
      }
    case SubmitNotification.SUCCESS:
      return {
        ...state,
        sendState: SendingState.COMPLETE,
      }
    case SubmitNotification.REQUEST:
      return {
        ...state,
        requestIsOpen: false,
        sendState: SendingState.WAITING,
      }
    case ToggleRequest.CLOSE:
      return {
        checkedInputs: (<ToggleRequestAction>action).payload.checkedInputs,
        requestIsOpen: false,
        sendState: SendingState.IDLE,
      }
    case ToggleRequest.OPEN:
      return {
        checkedInputs: (<ToggleRequestAction>action).payload.checkedInputs,
        requestIsOpen: true,
        sendState: SendingState.IDLE,
      }
    default:
      return state;
  }
};
