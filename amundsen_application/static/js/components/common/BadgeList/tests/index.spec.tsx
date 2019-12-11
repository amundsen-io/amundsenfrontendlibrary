import * as React from 'react';
import { shallow } from 'enzyme';

import AppConfig from 'config/config';
import { BadgeStyle } from 'config/config-types';
import BadgeList from '../'
import { Badge, TagType } from 'interfaces/Tags';
import Flag from 'components/common/Flag';
import { getBadgeConfig } from 'config/config-utils';

describe('BadgeList', () => {
  AppConfig.badges = {
    'test_1': {
      style: BadgeStyle.DANGER,
      displayName: 'Test 1',
    },
    'test_2': {
      style: BadgeStyle.DANGER,
      displayName: 'Test 2',
    }
  };

  describe('getBadgeConfig', () => {
    it('Returns the badge config for a given badge', () => {
      const badgeConfig = getBadgeConfig('test_1');
      expect(badgeConfig.style).toEqual(BadgeStyle.DANGER);
      expect(badgeConfig.displayName).toEqual('Test 1');
    });

    it('Returns default badge config for unspecified badges', () => {
      const badgeName = 'test_3';
      const badgeConfig = getBadgeConfig(badgeName);
      expect(badgeConfig.style).toEqual(BadgeStyle.DEFAULT);
      expect(badgeConfig.displayName).toEqual(badgeName);
    });
  });

  describe('BadgeList function component', () => {
    const badges: Badge[] = [
      {
        tag_name: 'test_1',
        tag_type: TagType.BADGE,
      },
      {
        tag_name: 'test_3',
        tag_type: TagType.BADGE,
      },
    ];

    const badgeList = shallow(<BadgeList badges={ badges } />);

    it('renders a badge-list element', () => {
      const container = badgeList.find('.badge-list')
      expect(container.exists()).toBe(true);
    });

    it('renders a <Flag> for each badge in the input', () => {
      expect(badgeList.find(Flag).length).toEqual(badges.length);
    });

    it('passes the correct props to the flag', () => {
      const flag = badgeList.childAt(0);
      const flagProps = flag.props();
      expect(flagProps.text).toEqual('Test 1');
      expect(flagProps.labelStyle).toEqual(BadgeStyle.DANGER);
    });
  });
});
