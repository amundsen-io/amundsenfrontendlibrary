import * as React from 'react';

import { shallow } from 'enzyme';

import { DashboardPage, DashboardPageProps, RouteProps } from './';
import { getMockRouterProps } from '../../fixtures/mockRouter';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Breadcrumb from 'components/common/Breadcrumb';
import BookmarkIcon from 'components/common/Bookmark/BookmarkIcon';
import TabsComponent from 'components/common/TabsComponent';
import ImagePreview from './ImagePreview';

import { ResourceType } from 'interfaces';

describe('DashboardPage', () => {
  const setup = (propOverrides?: Partial<DashboardPageProps>) => {
    const routerProps = getMockRouterProps<RouteProps>({ uri: 'test:uri/value' }, null);
    const props = {
      isLoading: false,
      dashboard: {
        badges: [],
        chart_names: ["chart 1", "chart 2"],
        cluster: "gold",
        created_timestamp: 1581023497,
        description: "TEST description name",
        frequent_users: [],
        group_name: "test_group_name",
        group_url: "test_group_url",
        last_run_state: "succeeded",
        last_run_timestamp: 1586812894,
        last_successful_run_timestamp: 1586812894,
        name: "Test Dashboard Name",
        owners: [
          {
            display_name: "test",
            email: "test@email.com",
            employee_type: "teamMember",
            first_name: "first",
            full_name: "first last",
            github_username: "",
            is_active: true,
            last_name: "last",
            manager_email: null,
            manager_fullname: "",
            profile_url: "profile_url",
            role_name: "SWE",
            slack_id: "",
            team_name: "team name",
            user_id: "user_id",
          }
        ],
        query_names: ["query 1", "query 2"],
        tables: [],
        tags: [],
        updated_timestamp: 1586672811,
        uri: "test_uri",
        url: "test_url",
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

    it('renders an ImagePreview with correct props', () => {
      expect(wrapper.find(ImagePreview).props().uri).toBe(wrapper.state().uri);
    })
  });

  describe('renderTabs', () => {
    const { props, wrapper } = setup();
    it('returns a Tabs component', () => {
      const result = wrapper.instance().renderTabs();
      expect(result.type).toEqual(TabsComponent);
    });
  });
});
