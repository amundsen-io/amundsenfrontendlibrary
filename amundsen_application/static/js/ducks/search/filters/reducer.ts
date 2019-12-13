import { FilterInput, ResourceType } from 'interfaces';

import { filterFromObj } from 'ducks/utilMethods';

export enum UpdateSearchFilter {
  ADD_MULTI_SELECT = 'amundsen/search/filter/ADD_MULTI_SELECT',
  REMOVE_MULTI_SELECT = 'amundsen/search/filter/REMOVE_MULTI_SELECT',
  UPDATE_SINGLE =  'amundsen/search/filter/UPDATE_SINGLE',
}
export interface UpdateSearchFilterAction {
  payload: FilterInput;
  type: UpdateSearchFilter;
};

/* ACTIONS */
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
  [ResourceType.table]: TableFilterReducerState;
};

export interface TableFilterReducerState {
  /* TODO: Future improvements allowing multiple values for all categories will simplify this */
  [category: string]: string | FilterOptions;
};

export const initialTableFilterState = {
  'column': '',
  'database': {},
  'schema': '',
  'table': '',
  'tag': '',
};

export const initialFilterState: FilterReducerState = {
  [ResourceType.table]: initialTableFilterState,
};

export default function reducer(state: FilterReducerState = initialFilterState, action, resourceType: ResourceType): FilterReducerState {
  const { category, value  } = action.payload;
  const resourceFilters = state[resourceType];
  const categoryValues = resourceFilters ? resourceFilters[category] : {};

  if (action.type === UpdateSearchFilter.UPDATE_SINGLE) {
    return {
      ...state,
      [resourceType]: {
        ...resourceFilters,
        [category]: value
      }
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
    return {
      ...state,
      [resourceType]: {
        ...resourceFilters,
        [category]: filterFromObj(categoryValues, [value])
      }
    }
  }

  return state;
};
