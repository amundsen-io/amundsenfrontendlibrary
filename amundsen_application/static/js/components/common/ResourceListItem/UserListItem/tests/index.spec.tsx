import * as React from 'react';

import { shallow } from 'enzyme';

import * as Avatar from 'react-avatar';
import Flag from 'components/common/Flag';
import { Link } from 'react-router-dom';

import UserListItem, { UserListItemProps } from '../';
import { ResourceType } from 'interfaces';

describe('UserListItem', () => {
  const setup = (propOverrides?: Partial<UserListItemProps>) => {
    const props: UserListItemProps = {
      logging: { source: 'src', index: 0 },
      user: {
        type: ResourceType.user,
        display_name: 'firstname lastname',
        email: 'test@test.com',
        employee_type: 'fulltime',
        first_name: 'firstname',
        full_name: 'firstname lastname',
        github_username: 'githubName',
        is_active: true,
        last_name: 'lastname',
        manager_fullname: 'Test Manager',
        profile_url: 'www.test.com',
        role_name: 'Tester',
        slack_id: 'www.slack.com',
        team_name: 'QA',
        user_id: 'test0',
      },
      ...propOverrides
    };
    const wrapper = shallow<UserListItem>(<UserListItem {...props} />);
    return { props, wrapper };
  };

  describe('render', () => {
    let props: UserListItemProps;
    let wrapper;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    it('renders item as Link', () => {
      expect(wrapper.find(Link).exists()).toBeTruthy();
    });

    describe('renders resource-info section', () => {
      let resourceInfo;
      beforeAll(() => {
        resourceInfo = wrapper.find('.resource-info');
      });

      it('renders Avatar', () => {
        expect(resourceInfo.find(Avatar).props()).toMatchObject({
          name: props.user.display_name,
          size: 24,
          round: true,
        });
      });

      it('renders user.name', () => {
        expect(resourceInfo.children().at(1).children().at(0).text()).toEqual(props.user.display_name);
      });

      it('renders description', () => {
        expect(resourceInfo.children().at(1).children().at(1).text()).toEqual(`${props.user.role_name} on ${props.user.team_name}`);
      });
    });

    describe('renders resource-type section', () => {
      let resourceType;
      beforeAll(() => {
        resourceType = wrapper.find('.resource-type');
      });

      it('renders resource type', () => {
        expect(resourceType.text()).toEqual('User');
      });
    });

    describe('renders resource-badges section', () => {
      let resourceBadges;
      beforeAll(() => {
        resourceBadges = wrapper.find('.resource-badges');
      });

      it('renders resource badges section', () => {
        expect(resourceBadges.exists()).toBe(true);
      });

      it('does not render Alumni flag if user is active', () => {
        expect(resourceBadges.find(Flag).exists()).toBe(false);
      });

      it('renders Alumni flag if user not active', () => {
        const wrapper = setup({
          user: {
            type: ResourceType.user,
            display_name: 'firstname lastname',
            email: 'test@test.com',
            employee_type: 'fulltime',
            first_name: 'firstname',
            full_name: 'firstname lastname',
            github_username: 'githubName',
            is_active: false,
            last_name: 'lastname',
            manager_fullname: 'Test Manager',
            profile_url: 'www.test.com',
            role_name: 'Tester',
            slack_id: 'www.slack.com',
            team_name: 'QA',
            user_id: 'test0',
          }
        }).wrapper;
        const flagComponent = wrapper.find('.resource-badges').find(Flag);
        expect(flagComponent.exists()).toBe(true);
        expect(flagComponent.props()).toMatchObject({
          text: 'Alumni',
          labelStyle: 'danger',
        });
      });

      it('renders correct end icon', () => {
        const expectedClassName = 'icon icon-right'
        expect(resourceBadges.find('img').props().className).toEqual(expectedClassName);
      });
    });
  });

  describe('getLink', () => {
    it('getLink returns correct string', () => {
      const { props, wrapper } = setup();
      const { user, logging } = props;
      expect(wrapper.instance().getLink()).toEqual(`/user/${user.user_id}?index=${logging.index}&source=${logging.source}`);
    });
  });
});
