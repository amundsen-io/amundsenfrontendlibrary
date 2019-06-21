import { UpdateOwnerPayload, User } from 'interfaces';

import {
  GetTableData, GetTableDataResponse,
  UpdateTableOwner, UpdateTableOwnerRequest, UpdateTableOwnerResponse,
} from '../types';

/* ACTIONS */
export function updateTableOwner(updateArray: UpdateOwnerPayload[], onSuccess?: () => any, onFailure?: () => any): UpdateTableOwnerRequest {
  return {
    type: UpdateTableOwner.REQUEST,
    payload: {
      onSuccess,
      onFailure,
      updateArray,
    },
  };
};
export function updateTableOwnerFailure(owners: {[id: string] : User}): UpdateTableOwnerResponse  {
  return {
    type: UpdateTableOwner.FAILURE,
    payload: {
      owners
    }
  };
};
export function updateTableOwnerSuccess(owners: {[id: string] : User}): UpdateTableOwnerResponse  {
  return {
    type: UpdateTableOwner.SUCCESS,
    payload: {
      owners
    }
  };
};

/* REDUCER */
export interface TableOwnerReducerState {
  isLoading: boolean;
  owners: { [id: string] : User };
};

export const initialOwnersState: TableOwnerReducerState = {
  isLoading: true,
  owners: {},
};

export default function reducer(state: TableOwnerReducerState = initialOwnersState, action): TableOwnerReducerState {
  switch (action.type) {
    case GetTableData.REQUEST:
      return { isLoading: true, owners: {} };
    case GetTableData.FAILURE:
    case GetTableData.SUCCESS:
      return { isLoading: false, owners: (<GetTableDataResponse>action).payload.owners };
    case UpdateTableOwner.REQUEST:
      return { ...state, isLoading: true };
    case UpdateTableOwner.FAILURE:
    case UpdateTableOwner.SUCCESS:
      return { isLoading: false, owners: (<UpdateTableOwnerResponse>action).payload.owners };
    default:
      return state;
  }
}
