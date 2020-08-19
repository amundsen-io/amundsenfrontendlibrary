// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { mount } from 'enzyme';

import RunStateContainer, { RunStateProps } from '.';

const setup = (propsOverrides?: Partial<RunStateProps>) => {
  const props = {
    stateText: '',
    succeeded: false,
    ...propsOverrides,
  };
  const wrapper = mount<typeof RunStateContainer>(
    <RunStateContainer {...props} />
  );
  return { props, wrapper };
};

describe('RunStateContainer', () => {
  describe('Hit', () => {
    const { wrapper } = setup({
      stateText: 'Hit',
      succeeded: true,
    });
    it('renders HitState when lastRunState successful', () => {
      const expected = 1;
      const actual = wrapper.find('.hit').length;

      expect(actual).toEqual(expected);
    });
  });
  describe('Missed', () => {
    const { wrapper } = setup({ 
        stateText: 'Missed',
     });
    it('renders MissedState when lastRunState failed', () => {
      const expected = 1;
      const actual = wrapper.find('.missed').length;

      expect(actual).toEqual(expected);
    });
    it('renders missed icon', () => {
      const expected = 1;
      const actual = wrapper.find('.missed-icon').length;

      expect(expected).toEqual(actual);
    });
  });
});
