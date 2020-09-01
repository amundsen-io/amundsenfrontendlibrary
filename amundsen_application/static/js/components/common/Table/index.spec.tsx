import * as React from 'react';
import { mount } from 'enzyme';

import Table, { TableProps } from '.';

const setup = (propOverrides?: Partial<TableProps>) => {
  const props = {
    ...propOverrides,
  };
  const wrapper = mount<TableProps>(<Table {...props} />);

  return { props, wrapper };
};

describe('Table', () => {
  describe('render', () => {
    it('renders without issues', () => {
      expect(() => {
        setup();
      }).not.toThrow();
    });
  });

  describe('lifetime', () => {});
});
