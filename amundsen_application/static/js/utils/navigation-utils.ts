import * as qs from 'simple-query-string';
import { createBrowserHistory } from 'history';

import { ResourceType } from 'interfaces/Resources';

// https://github.com/ReactTraining/react-router/issues/3972#issuecomment-264805667
export const BrowserHistory = createBrowserHistory();

interface SearchParams {
  term?: string;
  resource?: ResourceType;
  index?: number;
  filters?: {};
}

export const updateSearchUrl = (searchParams: SearchParams, replace: boolean = false) => {
  const filtersForResource = searchParams.filters && searchParams.filters[searchParams.resource] || {};
  const hasFilters = Object.keys(filtersForResource).length > 0;
  let newUrl = "/search";

  if (!!searchParams.term || hasFilters) {
    // Explicitly listing out parameters to ensure consistent URL format
    const queryStringValues = {
      term: searchParams.term || undefined,
      resource: searchParams.resource,
      index: searchParams.index,
    };

    if (hasFilters) {
      queryStringValues['filters'] = filtersForResource;
    }

    const urlParams = qs.stringify(queryStringValues);
    newUrl = `${newUrl}?${urlParams}`;
  }

  if (replace) {
    BrowserHistory.replace(newUrl);
  } else {
    BrowserHistory.push(newUrl);
  }
};
