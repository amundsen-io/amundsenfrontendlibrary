import { ResourceType } from 'interfaces';

interface FilterInput {
  category: string;
  value: string;
}

export enum UpdateSearchFilter {
  ADD = 'amundsen/search/filter/ADD',
  REMOVE = 'amundsen/search/filter/REMOVE',
}
export interface UpdateSearchFilterAction {
  payload: FilterInput;
  type: UpdateSearchFilter.ADD | UpdateSearchFilter.REMOVE;
};

/* ACTIONS */
export function addFilter(input: FilterInput) {
  const { category, value } = input;
  return {
    payload: {
      category,
      value
    },
    type: UpdateSearchFilter.ADD,
  };
};
export function removeFromFilter(input: FilterInput) {
  const { category, value } = input;
  return {
    payload: {
      category,
      value
    },
    type: UpdateSearchFilter.REMOVE,
  };
};

/* REDUCER */
export type FilterCategories = { [id:string]: string };
export interface FilterReducerState {
  [ResourceType.table]: TableFilterReducerState;
};
export interface TableFilterReducerState {
  column: FilterCategories;
  database: FilterCategories;
  schema: FilterCategories;
  table: FilterCategories;
  tag: FilterCategories;
};

export const initialTableFilterState = {
  column: {},
  database: {},
  schema: {},
  table: {},
  tag: {},
};

export const initialFilterState: FilterReducerState = {
  [ResourceType.table]: initialTableFilterState,
};

export default function reducer(state: FilterReducerState = initialFilterState, action, resourceType: ResourceType): FilterReducerState {
  const { category, value  } = action.payload;
  const previousResourceFilters = state[resourceType];
  const previousCategoryValues = previousResourceFilters && previousResourceFilters[category];
  if (previousCategoryValues) {
    if (action.type === UpdateSearchFilter.ADD) {
      return {
        ...state,
        [resourceType]: {
          ...previousResourceFilters,
          [category]: {
            ...previousCategoryValues,
            [value]: value,
          }
        }
      }
    };
    if (action.type === UpdateSearchFilter.REMOVE) {
      return {
        ...state,
        [resourceType]: {
          ...previousResourceFilters,
          [category]: Object.keys(previousCategoryValues).reduce((object, key) => {
            if (key !== value) {
              object[key] = previousCategoryValues[key]
            }
            return object
          }, {}),
        }
      }
    }
  }
  return state;
};
