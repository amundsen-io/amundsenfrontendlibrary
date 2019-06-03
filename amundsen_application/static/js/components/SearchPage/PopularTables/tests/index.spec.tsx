import * as React from 'react';
import { shallow } from 'enzyme';

import {
  POPULAR_TABLES_INFO_TEXT,
  POPULAR_TABLES_LABEL,
  POPULAR_TABLES_SOURCE_NAME,
} from '../constants';
import InfoButton from 'components/common/InfoButton';
import SearchList from 'components/SearchPage/SearchList';
import { PopularTables, PopularTablesProps } from '../';

describe('PopularTables', () => {
  const setup = (propOverrides?: Partial<PopularTablesProps>) => {
    const props: PopularTablesProps = {
      popularTables: jest.fn() as any,
      getPopularTables: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<PopularTables>(<PopularTables {...props} />)

    return { props, wrapper };
  };
  
  describe('render', () => {
    let wrapper;
    let props;
    beforeAll(() => {
      const setupResult = setup();
      wrapper = setupResult.wrapper;
      props = setupResult.props;
    });
    it('renders correct label for content', () => {
      expect(wrapper.children().find('label').text()).toEqual(POPULAR_TABLES_LABEL);
    });

    it('renders InfoButton with correct props', () => {
      expect(wrapper.children().find(InfoButton).props()).toMatchObject({
        infoText: POPULAR_TABLES_INFO_TEXT,
      });
    });

    it('renders SearchList with correct props', () => {
      expect(wrapper.children().find(SearchList).props()).toMatchObject({
        results: props.popularTables,
        params: {
          source: POPULAR_TABLES_SOURCE_NAME,
          paginationStartIndex: 0,
        },
      });
    });
  });
});