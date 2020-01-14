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

  // Explicitly listing out parameters to ensure consistent URL format
  const queryStringValues = {
    term: searchParams.term,
    resource: searchParams.resource,
    index: searchParams.index,
  };

  if (Object.keys(filtersForResource).length > 0) {
    queryStringValues['filters'] = filtersForResource;
  }

  const urlParams = qs.stringify(queryStringValues);
  if (replace) {
    BrowserHistory.replace(`/search?${urlParams}`);
  } else {
    BrowserHistory.push(`/search?${urlParams}`);
  }
};
