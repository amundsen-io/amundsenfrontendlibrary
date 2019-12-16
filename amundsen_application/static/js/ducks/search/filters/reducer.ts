import { FilterInput, ResourceType } from 'interfaces';

import { filterFromObj } from 'ducks/utilMethods';

export enum UpdateSearchFilter {
  ADD_MULTI_SELECT = 'amundsen/search/filter/ADD_MULTI_SELECT',
  CLEAR_CATEGORY= 'amundsen/search/filter/CLEAR_CATEGORY',
  REMOVE_MULTI_SELECT = 'amundsen/search/filter/REMOVE_MULTI_SELECT',
  UPDATE_SINGLE =  'amundsen/search/filter/UPDATE_SINGLE',
}
export interface UpdateSearchFilterAction {
  payload: FilterInput;
  type: UpdateSearchFilter;
};

/* ACTIONS */
export function clearFilterByCategory(category: string) {
  return {
    payload: {
      category,
    },
    type: UpdateSearchFilter.CLEAR_CATEGORY,
  };
};

export function updateSingleOption(input: FilterInput) {
  const { category, value } = input;
  return {
    payload: {
      category,
      value
    },
    type: UpdateSearchFilter.UPDATE_SINGLE,
  };
};
export function addMultiSelectOption(input: FilterInput) {
  const { category, value } = input;
  return {
    payload: {
      category,
      value
    },
    type: UpdateSearchFilter.ADD_MULTI_SELECT,
  };
};
export function removeMultiSelectOption(input: FilterInput) {
  const { category, value } = input;
  return {
    payload: {
      category,
      value
    },
    type: UpdateSearchFilter.REMOVE_MULTI_SELECT,
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
  const { category, value  } = action.payload;
  const resourceFilters = state[resourceType];
  const categoryValues = resourceFilters ? resourceFilters[category] : {};

  let shouldClearCategory = false;

  if (action.type === UpdateSearchFilter.UPDATE_SINGLE) {
    if (value) {
      return {
        ...state,
        [resourceType]: {
          ...resourceFilters,
          [category]: value
        }
      }
    }
    else {
      shouldClearCategory = true;
    }
  }

  if (action.type === UpdateSearchFilter.ADD_MULTI_SELECT) {
    return {
      ...state,
      [resourceType]: {
        ...resourceFilters,
        [category]: {
          ...categoryValues,
          [value]: true,
        }
      }
    }
  }

  if (action.type === UpdateSearchFilter.REMOVE_MULTI_SELECT) {
    const newCategoryDict = filterFromObj(categoryValues, [value]);
    if (Object.keys(newCategoryDict).length > 0) {
      return {
        ...state,
        [resourceType]: {
          ...resourceFilters,
          [category]: newCategoryDict
        }
      }
    }
    else {
      shouldClearCategory = true;
    }
  }

  if (action.type == UpdateSearchFilter.CLEAR_CATEGORY || shouldClearCategory) {
    return {
      ...state,
      [resourceType]: filterFromObj(resourceFilters, [category])
    }
  }

  return state;
};
