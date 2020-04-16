import * as React from 'react';

import { shallow } from 'enzyme';

import { DashboardPage, DashboardPageProps, RouteProps } from './';
import { getMockRouterProps } from '../../fixtures/mockRouter';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Breadcrumb from 'components/common/Breadcrumb';
import BookmarkIcon from 'components/common/Bookmark/BookmarkIcon';
import TabsComponent from 'components/common/TabsComponent';

import { ResourceType } from 'interfaces';

describe('DashboardPage', () => {
  const setup = (propOverrides?: Partial<DashboardPageProps>) => {
    const routerProps = getMockRouterProps<RouteProps>({ uri: 'test:uri/value' }, null);
    const props = {
      isLoading: false,
      dashboard: {
        uri: 'test:uri/value',
        cluster: 'cluster',
        group_name: 'google group',
        group_url: 'https://google.com',
        name: 'lmgtfy dashboard',
        url: 'https://lmgtfy.com/?q=dashboard',
        description: 'test description',
        created_timestamp: 1582153297,
        updated_timestamp: 1582153297,
        last_run_timestamp: 1582153297,
        last_run_state: 'state',
        owners: [{
          email: 'dwon@lyft.com',
          display_name: 'Daniel Won',
          profile_url: "",
          user_id: 'dwon@lyft.com',
        }],
        frequent_users: [{
          read_count: 10,
          user: {
            email: 'dwon@lyft.com',
            display_name: 'Daniel Won',
            profile_url: "",
            user_id: 'dwon@lyft.com',
          }
        }],
        chart_names: [],
        query_names: [],
        tables: [],
        tags: [],
        },
      getDashboard: jest.fn(),
      ...routerProps,
      ...propOverrides,
    };

    const wrapper = shallow<DashboardPage>(<DashboardPage {...props} />)
    return { props, wrapper };
  };

  describe('render', () => {
    const { props, wrapper } = setup();

    it('renders the loading spinner when loading', () => {
      const { props, wrapper } = setup({ isLoading: true })
      expect(wrapper.find(LoadingSpinner).exists()).toBeTruthy();
    });

    it('renders a breadcrumb component', () => {
      expect(wrapper.find(Breadcrumb).exists()).toBeTruthy();
    });

    it('renders a the dashboard title', () => {
      const headerText = wrapper.find('.header-title-text').text();
      expect(headerText).toEqual(props.dashboard.name);
    });

    it('renders a bookmark icon with correct props', () => {
      const elementProps = wrapper.find(BookmarkIcon).props();
      expect(elementProps.bookmarkKey).toBe(props.dashboard.uri);
      expect(elementProps.resourceType).toBe(ResourceType.dashboard);
    });

  });

  describe('renderTabs', () => {
    const { props, wrapper } = setup();
    it('returns a Tabs component', () => {
      const result = wrapper.instance().renderTabs();
      expect(result.type).toEqual(TabsComponent);
    });
  });
});
