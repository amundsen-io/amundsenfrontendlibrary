import * as React from 'react';

import { shallow } from 'enzyme';
import SearchPanel, { SearchPanelProps } from '../';

describe('SearchPanel', () => {
  const resourceChild = (<div>I am a resource selector</div>);
  const filterChild = (<div>I am a a set of filters</div>);
  const setup = (propOverrides?: Partial<SearchPanelProps>) => {
    const props: SearchPanelProps = {
      resourceChild,
      filterChild,
      ...propOverrides
    };
    const wrapper = shallow(<SearchPanel {...props} />);
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

    it('renders resource section', () => {
      expect(wrapper.find('.resource-section').childAt(0)).toBe(resourceChild);
    });

    it('renders filter section', () => {
      expect(wrapper.find('.filter-section').childAt(0)).toBe(filterChild);
    });
  });
});
