import { RouteComponentProps } from 'react-router';

import * as History from 'history';

// Mock React-Router
export function getMockRouterProps<P>(data: P, location: Partial<History.Location>): RouteComponentProps<P> {
  const mockLocation: History.Location = {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: {},
    ...location,
  };

  const props: RouteComponentProps<P> = {
    match: {
      isExact: true,
      params: data,
      path: '',
      url: '',
    },
    location: mockLocation,
    history: {
      length: 2,
      action: 'POP',
      location: mockLocation,
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      block: jest.fn(),
      createHref: jest.fn(),
      listen: jest.fn(),
    },
    staticContext: {
    }
  };

  return props;
};
