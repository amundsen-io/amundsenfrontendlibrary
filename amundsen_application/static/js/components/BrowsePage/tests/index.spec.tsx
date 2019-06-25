import * as React from 'react';

import { shallow } from 'enzyme';

import { BrowsePage } from '../';

import BrowseTags from 'components/BrowseTags';

describe('BrowsePage', () => {
  const setup = () => {
    const wrapper = shallow<BrowsePage>(<BrowsePage/>)
    return { props, wrapper };
  };
  
  let props;
  let wrapper;

  beforeAll(() => {
    const setupResult = setup();
    props = setupResult.props;
    wrapper = setupResult.wrapper;
  });

  describe('render', () => {
    it('contains BrowseTags', () => {
      expect(wrapper.contains(<BrowseTags />));
    });
  });
});
