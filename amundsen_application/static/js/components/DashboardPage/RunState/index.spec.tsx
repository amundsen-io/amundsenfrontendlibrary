// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { mount } from 'enzyme';

import RunStateContainer, { RunStateProps } from '.';

import { LAST_RUN_SUCCEEDED, LAST_RUN_FAILED } from './constants';

const setup = (propsOverrides?: Partial<RunStateProps>) => {
  const props = {
    lastRunState: '',
    ...propsOverrides,
  };
  const wrapper = mount<typeof RunStateContainer>(
    <RunStateContainer {...props} />
  );
  return { props, wrapper };
};

describe('RunStateContainer', () => {
  describe('Hit', () => {
    const { wrapper } = setup({ lastRunState: LAST_RUN_SUCCEEDED });
    it('renders HitState when lastRunState successful', () => {
      const expected = 1;
      const actual = wrapper.find('.hit').length;

      expect(actual).toEqual(expected);
    });
  });
  describe('Missed', () => {
    const { wrapper } = setup({ lastRunState: LAST_RUN_FAILED });
    it('renders MissedState when lastRunState failed', () => {
      const expected = 1;
      const actual = wrapper.find('.missed').length;

      expect(actual).toEqual(expected);
    });
    it('renders missed icon', () => {
      const expected = 1;
      const actual = wrapper.find('.missed-icon').length;

      expect(actual).toEqual(actual);
    });
  });
});
