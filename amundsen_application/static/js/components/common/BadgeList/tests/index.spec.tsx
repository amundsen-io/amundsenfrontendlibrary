import * as React from 'react';
import { shallow } from 'enzyme';

import BadgeList from '../'
import { BadgeStyle } from 'config/config-types';
import * as ConfigUtils from 'config/config-utils';
import Flag from 'components/common/Flag';
import { Badge, TagType } from 'interfaces/Tags';


describe('BadgeList', () => {
  const expectedDisplayName = 'display name';
  const expectedBadgeStyle = BadgeStyle.PRIMARY;
  const getBadgeConfigSpy = jest.spyOn(ConfigUtils, 'getBadgeConfig');
  getBadgeConfigSpy.mockImplementation(() => {
    return {
      displayName: expectedDisplayName,
      style: expectedBadgeStyle,
    };
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
      expect(flagProps.text).toEqual(expectedDisplayName);
      expect(flagProps.labelStyle).toEqual(expectedBadgeStyle);
    });
  });
});
