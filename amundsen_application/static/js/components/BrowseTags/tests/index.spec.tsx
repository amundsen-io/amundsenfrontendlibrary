import * as React from 'react';

import { shallow } from 'enzyme';

import BrowseTags from '../';
import TagsList from '../TagsList';

describe('BrowseTags', () => {
  let subject;

  beforeEach(() => {
    subject = shallow(<BrowseTags/>);
  });

  describe('render', () => {
    it('renders correct header', () => {
      expect(subject.find('#browse-header').text()).toEqual('Browse Tags');
    });

    it('renders TagsList component', () => {
      expect(subject.contains(<TagsList/>));
    });
  });
});
