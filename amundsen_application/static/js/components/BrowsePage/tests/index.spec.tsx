import * as React from 'react';
import * as DocumentTitle from 'react-document-title';

import { shallow } from 'enzyme';

import { BrowsePage } from '../';
import TagsList from 'components/common/TagsList';

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
    it('renders DocumentTitle w/ correct title', () => {
      expect(wrapper.find(DocumentTitle).props().title).toEqual('Browse - Amundsen');
    });
    
    it('contains TagsList', () => {
      expect(wrapper.contains(<TagsList />));
    });
  });
});
