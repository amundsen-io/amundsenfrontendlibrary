// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { mount } from 'enzyme';

import ColumnList, { ColumnListProps } from '.';
import { EMPTY_MESSAGE } from './constants';

const setup = (propOverrides?: Partial<ColumnListProps>) => {
  const props = {
    editText: 'Click to edit description in the data source site',
    editUrl: 'https://test.datasource.site/table',
    database: 'testDatabase',
    columns: [],
    openRequestDescriptionDialog: jest.fn(),
    ...propOverrides,
  };
  const wrapper = mount<ColumnListProps>(<ColumnList {...props} />);

  return { props, wrapper };
};

describe('ColumnList', () => {
  describe('render', () => {
    it('renders without issues', () => {
      expect(() => {
        setup();
      }).not.toThrow();
    });

    describe('when empty columns are passed', () => {
      it('should render the custom empty messagee', () => {
        const { wrapper } = setup();
        const expected = EMPTY_MESSAGE;

        const actual = wrapper
          .find('.table-detail-table .ams-empty-message-cell')
          .text();
        expect(actual).toEqual(expected);
      });
    });
  });
});
