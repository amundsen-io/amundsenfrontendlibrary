import * as React from 'react';

import { shallow } from 'enzyme';

import { DashboardPage, DashboardPageProps, RouteProps } from './';
import { getMockRouterProps } from '../../fixtures/mockRouter';
import AvatarLabel from 'components/common/AvatarLabel';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Breadcrumb from 'components/common/Breadcrumb';
import BookmarkIcon from 'components/common/Bookmark/BookmarkIcon';
import Flag from 'components/common/Flag';
import TabsComponent from 'components/common/TabsComponent';
import ImagePreview from './ImagePreview';

import { ResourceType } from 'interfaces';

import { dashboardMetadata } from 'fixtures/metadata/dashboard';

import * as Constants from './constants';

describe('DashboardPage', () => {
  const setup = (propOverrides?: Partial<DashboardPageProps>) => {
    const routerProps = getMockRouterProps<RouteProps>({ uri: 'test:uri/value' }, null);
    const props = {
      isLoading: false,
      statusCode: 200,
      dashboard: dashboardMetadata,
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

    describe('renders owners', () => {
      it('with correct AvatarLabel if no owners exist', () => {
        const wrapper = setup({
          dashboard: {
            ...dashboardMetadata,
            owners: [],
          }
        }).wrapper;
        expect(wrapper.find(AvatarLabel).props().label).toBe(Constants.NO_OWNER_TEXT)
      });
    });

    it('renders a Flag for last run state', () => {
      const element = wrapper.find('.last-run-state').find(Flag);
      expect(element.props().text).toBe(props.dashboard.last_run_state);
    })

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
