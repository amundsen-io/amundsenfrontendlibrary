import { Tag } from 'interfaces';

import { GetAllTags, GetAllTagsRequest, GetAllTagsResponse } from './types';

/* ACTIONS */
export function getAllTags(): GetAllTagsRequest {
  return { type: GetAllTags.REQUEST };
};
export function getAllTagsFailure(): GetAllTagsResponse {
  return { type: GetAllTags.FAILURE, payload: { allTags: [], curatedTags: [], otherTags: [] } };
};
export function getAllTagsSuccess(allTags: Tag[], curatedTags: Tag[] = [], otherTags: Tag[] = []): GetAllTagsResponse {
  return { type: GetAllTags.SUCCESS, payload: { allTags, curatedTags, otherTags } };
};

/* REDUCER */
export interface AllTagsReducerState {
  allTags: Tag[];
  curatedTags: Tag[];
  otherTags: Tag[];
  isLoading: boolean;
};

export const initialState: AllTagsReducerState = {
  allTags: [],
  curatedTags: [],
  otherTags: [],
  isLoading: false,
};

export default function reducer(state: AllTagsReducerState = initialState, action): AllTagsReducerState {
  switch (action.type) {
    case GetAllTags.REQUEST:
      return { ...state, isLoading: true };
    case GetAllTags.FAILURE:
      return initialState;
    case GetAllTags.SUCCESS:
      return {
        ...state,
        ...(<GetAllTagsResponse>action).payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
