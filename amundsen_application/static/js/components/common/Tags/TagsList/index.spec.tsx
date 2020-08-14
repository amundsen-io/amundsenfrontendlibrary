// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { Link, BrowserRouter } from 'react-router-dom';

import { shallow } from 'enzyme';

import { strict } from 'assert';
import { all } from 'redux-saga/effects';
import TagsList, { TagsListProps } from '.';

const POPULAR_TAGS_NUMBER = 20;

const allTestTags = [
  { tag_name: 'test test', tag_count: 3 },
  { tag_name: 'tao_test', tag_count: 1 },
  { tag_name: 'real-time', tag_count: 90 },
  { tag_name: 'tnt-feature', tag_count: 1 },
  { tag_name: 'test12', tag_count: 1 },
  { tag_name: 'xtest12', tag_count: 1 },
  { tag_name: 'ttannis2', tag_count: 2 },
  { tag_name: 'example', tag_count: 4 },
  { tag_name: 'audience-feature', tag_count: 1 },
  { tag_name: 'jinchangtest', tag_count: 1 },
  { tag_name: 'dispatch', tag_count: 1 },
  { tag_name: 'test9', tag_count: 48 },
  { tag_name: 'test2', tag_count: 2 },
  { tag_name: 'test5', tag_count: 14 },
  { tag_name: 'test', tag_count: 3 },
  { tag_name: 'test4', tag_count: 33 },
  { tag_name: 'testing', tag_count: 26 },
  { tag_name: 'support', tag_count: 51 },
  { tag_name: 'abc', tag_count: 4 },
  { tag_name: 'eta', tag_count: 27 },
  { tag_name: 'is testing', tag_count: 2 },
  { tag_name: 'tamika', tag_count: 6 },
  { tag_name: 'passenger-feature', tag_count: 1 },
  { tag_name: 'foobar', tag_count: 11 },
  { tag_name: 'fraud1', tag_count: 83 },
  { tag_name: 'new_tag', tag_count: 2 },
  { tag_name: 'testing2', tag_count: 1 },
  { tag_name: 'test*', tag_count: 1 },
  { tag_name: 'test_table', tag_count: 1 },
  { tag_name: 'invalid', tag_count: 2 },
  { tag_name: 'newtag2', tag_count: 4 },
  { tag_name: 'trips', tag_count: 45 },
  { tag_name: 'newvalue3', tag_count: 1 },
  { tag_name: 'pax', tag_count: 17 },
  { tag_name: 'ride', tag_count: 22 },
  { tag_name: 'fraud', tag_count: 7 },
  { tag_name: 'lbs', tag_count: 9 },
  { tag_name: 'communications', tag_count: 1 },
  { tag_name: 'perf', tag_count: 2 },
  { tag_name: 'a6n', tag_count: 2 },
  { tag_name: 'integration_test', tag_count: 1 },
  { tag_name: 'amundsen', tag_count: 3 },
  { tag_name: 'test1', tag_count: 1 },
  { tag_name: 'tbs', tag_count: 13 },
  { tag_name: 'acquisition', tag_count: 1 },
  { tag_name: 'newtag', tag_count: 1 },
  { tag_name: 'new_tag2', tag_count: 1 },
  { tag_name: 'bar', tag_count: 1 },
  { tag_name: 'test2 test 2', tag_count: 3 },
  { tag_name: 'test test2', tag_count: 2 },
  { tag_name: 'hive', tag_count: 1 },
  { tag_name: 'client', tag_count: 2 },
  { tag_name: 'hive1', tag_count: 4 },
  { tag_name: 'passenger', tag_count: 8 },
  { tag_name: 'tracking', tag_count: 1 },
  { tag_name: 'hello test', tag_count: 5 },
  { tag_name: 'newvalue', tag_count: 86 },
  { tag_name: 'foo', tag_count: 42 },
  { tag_name: 'bike', tag_count: 10 },
  { tag_name: 'engagement', tag_count: 1 },
  { tag_name: 'driver', tag_count: 2 },
  { tag_name: 'ml-platform', tag_count: 5 },
  { tag_name: 'event', tag_count: 1 },
  { tag_name: 'tracking-event', tag_count: 21 },
  { tag_name: 'finance', tag_count: 9 },
  { tag_name: 'newValue2', tag_count: 2 },
  { tag_name: 'regions', tag_count: 16 },
  { tag_name: 'coco', tag_count: 15 },
  { tag_name: 'tagger', tag_count: 1 },
  { tag_name: 'amundsen-test', tag_count: 3 },
  { tag_name: 'dp-tools', tag_count: 2 },
];

const popularTags = allTestTags.slice(0, POPULAR_TAGS_NUMBER).sort((a, b) => {
  if (a.tag_name < b.tag_name) return -1;
  if (a.tag_name > b.tag_name) return 1;
  return 0;
});

const otherTags = allTestTags
  .slice(POPULAR_TAGS_NUMBER, allTestTags.length)
  .sort((a, b) => {
    if (a.tag_name < b.tag_name) return -1;
    if (a.tag_name > b.tag_name) return 1;
    return 0;
  });

const setup = (propOverrides?: Partial<TagsListProps>) => {
  const props = {
    curatedTags: [],
    popularTags: [],
    otherTags: [],
    ...propOverrides,
  };
  const wrapper = shallow<typeof TagsList>(<TagsList {...props} />).dive();
  return { props, wrapper };
};

describe('TagsList', () => {
  describe('render shortTagsList with popular tags', () => {
    const { wrapper } = setup({
      popularTags,
      otherTags,
      isLoading: false,
      shortTagsList: true,
    });

    it('should render shortTagsList', () => {
      const expected = 1;
      const actual = wrapper.find('.short-tag-list').length;

      expect(actual).toEqual(expected);
    });

    it('should render TagsListTitle', () => {
      wrapper.children();
      const expected = 1;
      const actual = wrapper.childAt(0).shallow().find('.section-title').length;

      expect(actual).toEqual(expected);
    });

    it('should render TagsListBlock', () => {
      const expected = 1;
      const actual = wrapper.childAt(1).shallow().find('.tags-list').length;

      expect(actual).toEqual(expected);
    });

    it('should render Browse more tags link', () => {
      const expected = 1;
      const actual = wrapper.find('.browse-tags-link').length;

      expect(actual).toEqual(expected);
    });
  });

  describe('render longTagsList with popular tags', () => {
    const { wrapper } = setup({
      popularTags,
      otherTags,
      isLoading: false,
      shortTagsList: false,
    });

    const allChildren = wrapper.children().map((child) => child.shallow());
    
    it('should render longTagsList', () => {
      const expected = 1;
      const actual = wrapper.find('.full-tag-list').length;

      expect(actual).toEqual(expected);
    });

    it('should render TagsListTitle', () => {
      const expected = 1;
      let actual = 0;

      allChildren.forEach((comp) => {
        if (comp.find('#browse-header').exists()) {
          actual++;
        }
      });

      expect(actual).toEqual(expected);
    });

    it('should render TagsListLabels for both sections', () => {
      const expected = 2;
      let actual = 0;

      allChildren.forEach((comp) => {
        if (comp.find('.section-label').exists()) {
          actual++;
        }
      });

      expect(actual).toEqual(expected);
    });

    it('should render TagsListBlock for both Popular Tags section and Other Tags section', () => {
      const expected = 2;
      let actual = 0;

      allChildren.forEach((comp) => {
        if (comp.find('.tags-list').exists()) {
          actual++;
        }
      });
      expect(actual).toEqual(expected);
    });
  });
});
