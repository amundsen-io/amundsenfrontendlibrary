import * as React from 'react';
import SanitizedHTML from 'react-sanitized-html';
import { mount } from 'enzyme';

import SourceLink, { SourceLinkProps } from '.';
import AvatarLabel from 'components/common/AvatarLabel';
import AppConfig from 'config/config';
import { ResourceType } from 'interfaces/Resources';

const setup = (propOverrides?: Partial<SourceLinkProps>) => {
  const props = {
    tableSource: {
      source_type: 'xyz',
      source: 'www.xyz.com',
    },
    ...propOverrides,
  };
  const wrapper = mount<typeof SourceLink>(<SourceLink {...props} />);
  return { props, wrapper };
};

describe('render SourceLink', () => {
  describe('render', () => {
    it('renders without issues', () => {
      expect(() => {
        setup();
      }).not.toThrow();
    });

    it('renders icon and source link', () => {
      const { wrapper } = setup();
      const expected = 1;
      const actual = wrapper.find('.header-link').length;

      expect(actual).toEqual(expected);
    });

    it('renders correct source link', () => {
      const { wrapper } = setup();
      const expected = 'www.xyz.com';
      const actual = wrapper
        .find('.header-link')
        .getDOMNode()
        .attributes.getNamedItem('href').value;

      expect(actual).toEqual(expected);
    });
  });

  describe('renders AvatarLabel with correct props', () => {
    beforeAll(() => {
      AppConfig.resourceConfig = {
        [ResourceType.table]: {
          displayName: 'Tables',
          supportedDescriptionSources: {
            xyz: {
              displayName: 'XYZ',
              iconPath: 'images/xyz.png',
            },
            abc: {
              displayName: 'ABC',
              iconPath: 'images/abc.png',
            },
          },
        },
        [ResourceType.dashboard]: {
          displayName: 'Dashboards',
        },
        [ResourceType.user]: {
          displayName: 'Users',
        },
      };
    });

    it('renders AvatarLabel', () => {
      const { wrapper } = setup();
      const expected = 1;
      const actual = wrapper.find(AvatarLabel).length;

      expect(actual).toEqual(expected);
    });

    describe('renders correct display name and icon path', () => {
      it('when source type is present in configurations', () => {
        const { wrapper } = setup();
        const expected = { label: 'XYZ', src: 'images/xyz.png' };
        const actual = wrapper.find(AvatarLabel).props();

        expect(actual).toMatchObject(expected);
      });

      it('when source type is present not present in configurations', () => {
        const { wrapper } = setup({
          tableSource: {
            source_type: 'foo',
            source: 'www.bar.xz',
          },
        });
        const expected = { label: 'foo', src: '' };
        const actual = wrapper.find(AvatarLabel).props();

        expect(actual).toMatchObject(expected);
      });
    });
  });
});
