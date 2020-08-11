// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import * as DocumentTitle from 'react-document-title';

import { shallow } from 'enzyme';

import TagsListContainer from 'components/Tags';
import { BrowsePage } from '..';

describe('BrowsePage', () => {
  const setup = () => {
    const wrapper = shallow<BrowsePage>(<BrowsePage />);
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
      expect(wrapper.find(DocumentTitle).props().title).toEqual(
        'Browse - Amundsen'
      );
    });

    it('renders <hr>', () => {
      expect(wrapper.contains(<hr className="header-hr" />));
    });

    it('contains TagsList', () => {
      const expected = 1;
      const actual = wrapper.find(TagsListContainer).length;
      expect(actual).toEqual(expected);
    });
  });
});
