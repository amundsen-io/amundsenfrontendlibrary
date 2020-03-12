import { ResourceType } from 'interfaces';

import { filterFromObj } from 'ducks/utilMethods';

import { SubmitSearchResource } from 'ducks/search/types';

/* ACTION TYPES */
export enum UpdateSearchFilter {
  CLEAR_CATEGORY = 'amundsen/search/filter/CLEAR_CATEGORY',
  UPDATE_CATEGORY = 'amundsen/search/filter/UPDATE_CATEGORY',
};

export interface ClearFilterRequest {
  payload: {
    categoryId: string;
  };
  type: UpdateSearchFilter.CLEAR_CATEGORY;
};

export interface UpdateFilterRequest {
  payload: {
    categoryId: string;
    value: string | FilterOptions;
  };
  type: UpdateSearchFilter.UPDATE_CATEGORY;
};

/* ACTIONS */
export function clearFilterByCategory(categoryId: string): ClearFilterRequest {
  return {
    payload: {
      categoryId,
    },
    type: UpdateSearchFilter.CLEAR_CATEGORY,
  };
};

export function updateFilterByCategory(categoryId: string, value: string | FilterOptions): UpdateFilterRequest {
  return {
    payload: {
      categoryId,
      value
    },
    type: UpdateSearchFilter.UPDATE_CATEGORY,
  };
};

/* REDUCER TYPES */
export type FilterOptions = { [id:string]: boolean };

export interface FilterReducerState {
  [ResourceType.table]: ResourceFilterReducerState;
};

export interface ResourceFilterReducerState {
  [categoryId: string]: string | FilterOptions;
};

/* REDUCER */
export const initialTableFilterState = {};

export const initialFilterState: FilterReducerState = {
  [ResourceType.table]: initialTableFilterState,
};

export default function reducer(state: FilterReducerState = initialFilterState, action, resourceType: ResourceType): FilterReducerState {
  const resourceFilters = state[resourceType];
  const { payload, type } = action;

  switch (type) {
    case SubmitSearchResource.REQUEST:
      if (payload.selectedTab && payload.filters) {
        return {
          ...state,
          [payload.selectedTab]: payload.filters
        };
      }
      return state;
    case UpdateSearchFilter.CLEAR_CATEGORY:
      return {
        ...state,
        [resourceType]: filterFromObj(resourceFilters, [payload.categoryId])
      };
    case UpdateSearchFilter.UPDATE_CATEGORY:
      return {
        ...state,
        [resourceType]: {
          ...resourceFilters,
          [payload.categoryId]: payload.value
        }
      };
    default:
      return state;
  };
};
