// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Dropdown } from 'react-bootstrap';
import { mount } from 'enzyme';

import ListSortingDropdown, { ListSortingDropdownProps } from '.';

const DEFAULT_SORTING = {
  name: 'Table Default',
  type: 'sort_order',
};
const USAGE_SORTING = {
  name: 'Usage Count',
  type: 'usage',
};

const setup = (propOverrides?: Partial<ListSortingDropdownProps>) => {
  const props = {
    options: [],
    ...propOverrides,
  };
  const wrapper = mount<typeof ListSortingDropdown>(
    <ListSortingDropdown {...props} />
  );

  return { props, wrapper };
};

describe('ListSortingDropdown', () => {
  describe('render', () => {
    it('renders without issues', () => {
      expect(() => {
        setup();
      }).not.toThrow();
    });
  });

  describe('when no options are passed', () => {
    it('does not render the component', () => {
      const { wrapper } = setup();
      const expected = 0;
      const actual = wrapper.find('.list-sorting-dropdown').length;

      expect(actual).toEqual(expected);
    });
  });

  describe('when one option is passed', () => {
    it('renders a DropDown component', () => {
      const { wrapper } = setup({ options: [DEFAULT_SORTING] });
      const expected = 1;
      const actual = wrapper.find(Dropdown).length;

      expect(actual).toEqual(expected);
    });

    it('renders one item', () => {
      const { wrapper } = setup({ options: [DEFAULT_SORTING] });
      const expected = 2;
      const actual = wrapper.find('.list-sorting-dropdown button.btn').length;

      expect(actual).toEqual(expected);
    });
  });

  describe('when two options are passed', () => {
    it('renders a DropDown component', () => {
      const { wrapper } = setup({ options: [DEFAULT_SORTING, USAGE_SORTING] });
      const expected = 1;
      const actual = wrapper.find(Dropdown).length;

      expect(actual).toEqual(expected);
    });

    it('renders two items', () => {
      const { wrapper } = setup({ options: [DEFAULT_SORTING, USAGE_SORTING] });
      const expected = 3;
      const actual = wrapper.find('.list-sorting-dropdown button.btn').length;

      expect(actual).toEqual(expected);
    });
  });
});
