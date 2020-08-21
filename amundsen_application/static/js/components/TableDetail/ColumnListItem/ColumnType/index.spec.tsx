// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { mount } from 'enzyme';

import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';

import ColumnType, { ColumnTypeProps } from '.';

// const logClickSpy = jest.spyOn(UtilMethods, 'logClick');
// logClickSpy.mockImplementation(() => null);

const setup = (propOverrides?: Partial<ColumnTypeProps>) => {
  const props = {
    columnIndex: 0,
    columnName: 'test',
    type:
      'row(test_id varchar,test2 row(test2_id varchar,started_at timestamp,ended_at timestamp))',
    ...propOverrides,
  };
  const wrapper = mount<ColumnType>(<ColumnType {...props} />);
  return { wrapper, props };
};
const { wrapper, props } = setup();

describe('ColumnType', () => {
  describe('lifecycle', () => {
    /* TODO */
  });

  describe('render', () => {
    it('renders the column type string for simple types', () => {
      const { wrapper, props } = setup({ type: 'varchar(32)' });
      expect(wrapper.find('.column-type').text()).toBe(props.type);
    });

    it('renders the truncated column type string for nested types', () => {
      const expectedText = 'row(...)';
      expect(wrapper.find('.column-type').text()).toBe(expectedText);
    });
  });
});
