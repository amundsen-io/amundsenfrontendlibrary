import { SagaIterator } from 'redux-saga';
import { debounce, put, select } from 'redux-saga/effects';

import { SearchType } from 'interfaces';

import {
  submitSearchResource,
} from 'ducks/search/reducer';
import { getSearchState } from 'ducks/search/utils';
import { filterFromObj } from 'ducks/utilMethods';

import {
  UpdateSearchFilter,
  UpdateFilterRequest,
} from './reducer';

/**
 * Listens to actions triggers by user updates to the filter state.
 * For better user experience debounce the start of the worker as multiple updates can happen in < 1 second.
 */
export function* filterWatcher(): SagaIterator {
  yield debounce(750, UpdateSearchFilter.REQUEST, filterWorker);
};

/*
 * Executes a search on the current resource.
 * Actions that trigger this worker will have updated the filter reducer.
 * The updated filter state is applied in searchResourceWorker().
 * Updates the search url to reflect the change in filters.
 */
export function* filterWorker(action: UpdateFilterRequest): SagaIterator {
  const state = yield select(getSearchState);
  const { search_term, resource, filters } = state;
  const { categoryId, value } = action.payload;

  let resourceFilters = filters[resource] || {};
  if (value === null) {
    resourceFilters = filterFromObj(resourceFilters, [categoryId])
  }
  else {
    resourceFilters[categoryId] = value;
  }
  filters[resource] = resourceFilters;
  yield put(submitSearchResource({
    resource,
    resourceFilters,
    searchTerm: search_term,
    pageIndex: 0,
    searchType: SearchType.FILTER,
    updateUrl: true,
  }));
};
