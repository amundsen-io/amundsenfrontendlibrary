import { UpdateTagData, Tag, ResourceType } from 'interfaces';

import {
  GetTableData, GetTableDataResponse,
} from 'ducks/tableMetadata/types';

import {
  GetDashboard, GetDashboardResponse
} from 'ducks/dashboard/types';

import { GetAllTags, GetAllTagsRequest, GetAllTagsResponse,
  UpdateTags, UpdateTagsRequest, UpdateTagsResponse, } from './types';

/* ACTIONS */
export function getAllTags(): GetAllTagsRequest {
  return { type: GetAllTags.REQUEST };
};
export function getAllTagsFailure(): GetAllTagsResponse {
  return { type: GetAllTags.FAILURE, payload: { allTags: [] } };
};
export function getAllTagsSuccess(allTags: Tag[]): GetAllTagsResponse {
  return { type: GetAllTags.SUCCESS, payload: { allTags } };
};


export function updateTags(tagArray: UpdateTagData[], resourceType: ResourceType, uriKey: string): UpdateTagsRequest  {
  return {
    payload: {
      tagArray,
      resourceType,
      uriKey,
    },
    type: UpdateTags.REQUEST,
  };
};
export function updateTagsFailure(): UpdateTagsResponse  {
  return {
    type: UpdateTags.FAILURE,
    payload: {
      tags: [],
    }
  };
};
export function updateTagsSuccess(tags: Tag[]): UpdateTagsResponse  {
  return {
    type: UpdateTags.SUCCESS,
    payload: {
      tags
    }
  };
};

/* REDUCER */
export interface TagsReducerState {
  allTags: Tag[];
  isLoadingAllTags: boolean;
  isLoadingTags: boolean;
  tags: Tag[];
};

export const initialState: TagsReducerState = {
  allTags: [],
  isLoadingAllTags: false,
  isLoadingTags: false,
  tags: [],
};

export default function reducer(state: TagsReducerState = initialState, action): TagsReducerState {
  switch (action.type) {
    case GetAllTags.REQUEST:
      return { ...state, isLoadingAllTags: true };
    case GetAllTags.FAILURE:
      return initialState;
    case GetAllTags.SUCCESS:
      return {
        ...state,
        allTags: (<GetAllTagsResponse>action).payload.allTags,
        isLoadingAllTags: false,
      };

    case GetTableData.REQUEST:
      return { ...state, isLoadingTags: true, tags: [] };
    case GetTableData.FAILURE:
    case GetTableData.SUCCESS:
      return {
        ...state,
        isLoadingTags: false,
        tags: (<GetTableDataResponse>action).payload.tags,
      };

    case GetDashboard.REQUEST:
      return { ...state, isLoadingTags: true, tags: [] };
    case GetDashboard.FAILURE:
    case GetDashboard.SUCCESS:
      return {
        ...state,
        isLoadingTags: false,
        tags: (<GetDashboardResponse>action).payload.dashboard.tags
      };


    case UpdateTags.REQUEST:
      return { ...state, isLoadingTags: true };
    case UpdateTags.FAILURE:
      return { ...state, isLoadingTags: false };
    case UpdateTags.SUCCESS:
      return {
        ...state,
        isLoadingTags: false,
        tags: (<UpdateTagsResponse>action).payload.tags
      };

    default:
      return state;
  }
};


