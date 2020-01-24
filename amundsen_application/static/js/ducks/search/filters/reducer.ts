import { ResourceType } from 'interfaces';

import { filterFromObj } from 'ducks/utilMethods';

export enum UpdateSearchFilter {
  CLEAR_ALL = 'amundsen/search/filter/CLEAR_ALL',
  CLEAR_CATEGORY = 'amundsen/search/filter/CLEAR_CATEGORY',
  SET_BY_RESOURCE = 'amundsen/search/filter/SET_BY_RESOURCE',
  UPDATE_CATEGORY = 'amundsen/search/filter/UPDATE_CATEGORY',
}

/* TODO (ttannis): Add types for actions */

/* ACTIONS */
export function setFilterByResource(resourceType: ResourceType, filters: ResourceFilterReducerState) {
  return {
    payload: {
      resourceType,
      filters
    },
    type: UpdateSearchFilter.SET_BY_RESOURCE,
  };
};

export function clearAllFilters() {
  return {
    type: UpdateSearchFilter.CLEAR_ALL,
  };
};

export function clearFilterByCategory(category: string) {
  return {
    payload: {
      category,
    },
    type: UpdateSearchFilter.CLEAR_CATEGORY,
  };
};

export function updateFilterByCategory(category: string, value: string | FilterOptions) {
  return {
    payload: {
      category,
      value
    },
    type: UpdateSearchFilter.UPDATE_CATEGORY,
  };
};

/* REDUCER */
type FilterOptions = { [id:string]: boolean };

export interface FilterReducerState {
  [ResourceType.table]: ResourceFilterReducerState;
};

export interface ResourceFilterReducerState {
  /* TODO: Future improvements allowing multiple values for all categories will simplify this */
  [category: string]: string | FilterOptions;
};

export const initialTableFilterState = {};

export const initialFilterState: FilterReducerState = {
  [ResourceType.table]: initialTableFilterState,
};

export default function reducer(state: FilterReducerState = initialFilterState, action, resourceType: ResourceType): FilterReducerState {
  const resourceFilters = state[resourceType];
  const { payload, type } = action;

  switch (type) {
    case UpdateSearchFilter.CLEAR_ALL:
      return initialFilterState;
    case UpdateSearchFilter.CLEAR_CATEGORY:
      return {
        ...state,
        [resourceType]: filterFromObj(resourceFilters, [payload.category])
      };
    case UpdateSearchFilter.SET_BY_RESOURCE:
      return {
        ...state,
        [payload.resourceType]: payload.filters
      };
    case UpdateSearchFilter.UPDATE_CATEGORY:
      return {
        ...state,
        [resourceType]: {
          ...resourceFilters,
          [payload.category]: payload.value
        }
      };
    default:
      return state;
  };
};
