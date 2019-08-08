import * as React from 'react';

import { shallow } from 'enzyme';
import SearchPanel, { SearchPanelProps } from '../';
import ResourceSelector from 'components/SearchPage/ResourceSelector';

describe('SearchPanel', () => {
  const setup = (propOverrides?: Partial<SearchPanelProps>) => {
    const props = {
      onChange: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<SearchPanel>(<SearchPanel {...props} />);
    return { props, wrapper };
  };

  describe('render', () => {
    let props;
    let wrapper;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    it('renders a ResourceSelector', () => {
      expect(wrapper.find(ResourceSelector).exists()).toBe(true)
    });
  });
});

