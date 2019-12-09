import { FilterInput, ResourceType } from 'interfaces';

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
export type FilterCategories = { [id:string]: string };
export interface FilterReducerState {
  [ResourceType.table]: TableFilterReducerState;
};
export interface TableFilterReducerState {
  column: string;
  database: FilterCategories;
  schema: string;
  table: string;
  tag: string;
};

export const initialTableFilterState = {
  column: '',
  database: {},
  schema: '',
  table: '',
  tag: '',
};

export const initialFilterState: FilterReducerState = {
  [ResourceType.table]: initialTableFilterState,
};

export default function reducer(state: FilterReducerState = initialFilterState, action, resourceType: ResourceType): FilterReducerState {
  const { category, value  } = action.payload;
  const resourceFilters = state[resourceType];
  if (resourceFilters) {
    const categoryValues = resourceFilters[category];

    /* Input text filter update */
    if (action.type === UpdateSearchFilter.UPDATE_SINGLE) {
      return {
        ...state,
        [resourceType]: {
          ...resourceFilters,
          [category]: value
        }
      }
    }

    /* Checkbox filter update */
    if (categoryValues && typeof categoryValues === 'object') {
      if (action.type === UpdateSearchFilter.ADD_MULTI_SELECT) {
        return {
          ...state,
          [resourceType]: {
            ...resourceFilters,
            [category]: {
              ...categoryValues,
              [value]: value,
            }
          }
        }
      }
      if (action.type === UpdateSearchFilter.REMOVE_MULTI_SELECT) {
        return {
          ...state,
          [resourceType]: {
            ...resourceFilters,
            [category]: Object.keys(categoryValues).reduce((object, key) => {
              if (key !== value) {
                object[key] = categoryValues[key]
              }
              return object
            }, {}),
          }
        }
      }
    }
  }

  return state;
};
