import { UpdateTagData, Tag } from 'interfaces';

import {
  GetTableData, GetTableDataResponse,
  UpdateTags, UpdateTagsRequest, UpdateTagsResponse,
} from '../types';

/* ACTIONS */
export function updateTags(tagArray: UpdateTagData[]): UpdateTagsRequest  {
  return {
    tagArray,
    type: UpdateTags.REQUEST,
  };
};

/* REDUCER */
export interface TableTagsReducerState {
  isLoading: boolean;
  tags: Tag[];
};

export const initialTagsState: TableTagsReducerState = {
  isLoading: true,
  tags: [],
};

export default function reducer(state: TableTagsReducerState = initialTagsState, action): TableTagsReducerState {
  switch (action.type) {
    case GetTableData.REQUEST:
      return { isLoading: true, tags: [] };
    case GetTableData.FAILURE:
    case GetTableData.SUCCESS:
      return { isLoading: false, tags: (<GetTableDataResponse>action).payload.tags };
    case UpdateTags.FAILURE:
      return { ...state, isLoading: false };
    case UpdateTags.SUCCESS:
      return { isLoading: false, tags: (<UpdateTagsResponse>action).payload.tags };
    case UpdateTags.REQUEST:
      return { ...state, isLoading: true };
    default:
      return state;
  }
};
