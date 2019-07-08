import { RouteComponentProps } from 'react-router';

import * as History from 'history';

// Mock React-Router
export function getMockRouterProps<P>(data: P, location: History.Location): RouteComponentProps<P> {
  const defaultLocation: History.Location = {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: {},
  };
  const props: RouteComponentProps<P> = {
    match: {
      isExact: true,
      params: data,
      path: '',
      url: '',
    },
    location: location || defaultLocation,
    history: {
      length: 2,
      action: 'POP',
      location: location || defaultLocation,
      push: () => {},
      replace: null,
      go: null,
      goBack: null,
      goForward: null,
      block: null,
      createHref: null,
      listen: null,
    },
    staticContext: {
    }
  };

  return props;
};
