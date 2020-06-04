import * as React from 'react';

import { mount } from 'enzyme';

import QueryListITem, { QueryListItemProps } from './';


const setup = (propOverrides?: Partial<QueryListItemProps>) => {
  const props: QueryListItemProps = {
    key: "testKey",
    text: "testQuery",
    url: "http://test.url",
    name: "testName",
    ...propOverrides,
  };
  const wrapper = mount<QueryListITem>(<QueryListITem {...props} />);

  return { props, wrapper };
};

describe('QueryListItem', () => {

  describe('render', () => {

      it('should render without errors', () => {
        expect(() => {
          const { wrapper } = setup();
        }).not.toThrow();
      });
  });

});
