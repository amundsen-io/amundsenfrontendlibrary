import * as qs from 'simple-query-string';
import { createBrowserHistory } from 'history';

// https://github.com/ReactTraining/react-router/issues/3972#issuecomment-264805667
export const BrowserHistory = createBrowserHistory();

export const updateSearchUrl = (searchTerm?: string, resource?: string, pageIndex?: number) => {
  const urlParams = qs.stringify({ searchTerm, resource, pageIndex, });
  BrowserHistory.push(`/search?${urlParams}`);
};
