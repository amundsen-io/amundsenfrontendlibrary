// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { shallow } from 'enzyme';

import ClickableBadge from 'components/common/Badges';
import Flag from 'components/common/Flag';
import { BadgeStyle } from 'config/config-types';
import * as ConfigUtils from 'config/config-utils';
import { Badge } from 'interfaces/Badges';
import BadgeList, { BadgeListProps } from '.';

const columnBadges: Badge[] = [
  {
    badge_name: 'col badge 1',
    category: 'column',
  },
  {
    badge_name: 'col badge 2',
    category: 'column',
  }
];
const badges: Badge[] = [
  {
    badge_name: 'beta',
    category: 'table_status',
  },
  {
    badge_name: 'Core Concepts',
    category: 'coco',
  },
];

const setup = (propOverrides?: Partial<BadgeListProps>) => {
  const props = {
    badges: [],
    ...propOverrides,
  };
  const wrapper = shallow(<BadgeList {...props} />);

  return { props, wrapper };
};


describe('BadgeList', () => {
  const getBadgeConfigSpy = jest.spyOn(ConfigUtils, 'getBadgeConfig');
  getBadgeConfigSpy.mockImplementation((badgeName: string) => {
    return {
      displayName: badgeName + ' test name',
      style: BadgeStyle.PRIMARY,
    };
  });

  describe('when no badges are passed', () => {
    it('renders a badge-list element', () => {
      const { wrapper } = setup();
      const expected = 1;
      const actual = wrapper.find('.badge-list').length;

      expect(actual).toEqual(expected);
    });

    it('does not render any badges', () => {
      const { wrapper } = setup();
      const actual = wrapper.find(Flag).length;
      const expected = 0;

      expect(actual).toEqual(expected);
    });
  });

  describe('when badges are passed', () => {

    const badgeList = shallow(<BadgeList badges={badges} />);

    it('renders a badge-list element', () => {
      const { wrapper } = setup({ badges });
      const expected = 1;
      const actual = wrapper.find('.badge-list').length;

      expect(actual).toEqual(expected);
    });

    it('renders a <ClickableBadge> for each badge in the input', () => {
      const { wrapper } = setup({ badges });
      const expected = badges.length;
      const actual = wrapper.find(ClickableBadge).length;

      expect(actual).toEqual(expected);
    });

    // TODO: Move into a specific test for the getBadgeConfi
    xit('passes the correct props to the Clickable Badge', () => {
      badges.forEach((badge, index) => {
        const clickableBadge = badgeList.childAt(index);
        const clickableBadgeProps = clickableBadge.props();
        const badgeConfig = ConfigUtils.getBadgeConfig(badge.badge_name);

        expect(clickableBadgeProps.text).toEqual(badgeConfig.displayName);
        expect(clickableBadgeProps.labelStyle).toEqual(badgeConfig.style);
      });
    });
  });

  describe('when badge category is column', () => {
    it('renders a badge-list element', () => {
      const { wrapper } = setup({ badges: columnBadges });
      const expected = 1;
      const actual = wrapper.find('.badge-list').length;

      expect(actual).toEqual(expected);
    });

    it('renders a <Flag> for each badge in the input', () => {
      const { wrapper } = setup({ badges: columnBadges });
      const expected = 2;
      const actual = wrapper.find(Flag).length;

      expect(actual).toEqual(expected);
    });
  });
});
