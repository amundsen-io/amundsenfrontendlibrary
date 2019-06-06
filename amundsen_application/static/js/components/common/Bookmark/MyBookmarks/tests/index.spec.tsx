import * as React from 'react';

import { shallow } from 'enzyme';

import globalState from 'fixtures/globalState';
import { ResourceType } from 'components/common/ResourceListItem/types';
import Pagination from 'react-js-pagination';
import { MyBookmarks, MyBookmarksProps, mapStateToProps } from "../";
import {
  BOOKMARK_TITLE,
  EMPTY_BOOKMARK_MESSAGE,
  ITEMS_PER_PAGE,
  MY_BOOKMARKS_SOURCE_NAME,
} from '../constants';
import ResourceList from "components/common/ResourceList";

describe('MyBookmarks', () => {
  const setStateSpy = jest.spyOn(MyBookmarks.prototype, 'setState');

  const setup = (propOverrides?: Partial<MyBookmarksProps>) => {
    const props: MyBookmarksProps = {
      myBookmarks: [
        {
          key: 'bookmark-1',
          type: ResourceType.table,
          cluster: 'cluster',
          database: 'database',
          description: 'description',
          name: 'name',
          schema_name: 'schema_name',
        },
        {
          key: 'bookmark-2',
          type: ResourceType.table,
          cluster: 'cluster',
          database: 'database',
          description: 'description',
          name: 'name',
          schema_name: 'schema_name',
        },
        {
          key: 'bookmark-3',
          type: ResourceType.table,
          cluster: 'cluster',
          database: 'database',
          description: 'description',
          name: 'name',
          schema_name: 'schema_name',
        },
        {
          key: 'bookmark-4',
          type: ResourceType.table,
          cluster: 'cluster',
          database: 'database',
          description: 'description',
          name: 'name',
          schema_name: 'schema_name',
        },
        {
          key: 'bookmark-5',
          type: ResourceType.table,
          cluster: 'cluster',
          database: 'database',
          description: 'description',
          name: 'name',
          schema_name: 'schema_name',
        },
        {
          key: 'bookmark-6',
          type: ResourceType.table,
          cluster: 'cluster',
          database: 'database',
          description: 'description',
          name: 'name',
          schema_name: 'schema_name',
        },
      ],
      isLoaded: true,
      ...propOverrides
    };
    const wrapper = shallow<MyBookmarks>(<MyBookmarks {...props} />);
    return { props, wrapper };
  };

  describe('onPaginationChange', () => {
    it('reduces the page index by 1 and updates state', () => {
      const { props, wrapper } = setup();
        const pageNumber = 3;
        wrapper.instance().onPaginationChange(pageNumber);
        expect(setStateSpy).toHaveBeenCalledWith({ activePage: pageNumber - 1 });
    });
  });


  describe('Render', () => {
    it('Renders nothing until ready', () => {
      const { props, wrapper } = setup({ isLoaded: false });
      expect(wrapper.html()).toBeFalsy();
    });

    it('Renders the correct title', () => {
      const { props, wrapper } = setup();
      expect(wrapper.find('.title-1').text()).toEqual(BOOKMARK_TITLE);
    });

    it('Shows the EMPTY_BOOKMARK_MESSAGE when there are no bookmarks', () => {
      const { props, wrapper } = setup({ myBookmarks: [] });
      expect(wrapper.find('.empty-message').text()).toEqual(EMPTY_BOOKMARK_MESSAGE);
    });

    it('Renders ResourceList with the correct props', () => {
      const { props, wrapper } = setup();
      const startIndex = wrapper.state().activePage * ITEMS_PER_PAGE;
      const displayedBookmarks = props.myBookmarks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      expect(wrapper.children().find(ResourceList).props()).toMatchObject({
          resources: displayedBookmarks,
          source: MY_BOOKMARKS_SOURCE_NAME,
          startIndex: wrapper.state().activePage * ITEMS_PER_PAGE,
        });
    });

    it('Renders a pagination widget when there are more than ITEMS_PER_PAGE bookmarks', () => {
      const { props, wrapper } = setup();
      expect(wrapper.find(Pagination).exists()).toBe(true)
    });

    it('Hides a pagination widget when there are fewer than ITEMS_PER_PAGE bookmarks', () => {
      const { props, wrapper } = setup({
        myBookmarks: [{
          key: 'bookmark-1',
          type: ResourceType.table,
          cluster: 'cluster',
          database: 'database',
          description: 'description',
          name: 'name',
          schema_name: 'schema_name',
        }]
      });
      expect(wrapper.find(Pagination).exists()).toBe(false)
    });
  });
});


describe('mapStateToProps', () => {
  let result;
  beforeAll(() => {
    result = mapStateToProps(globalState);
  });

  it('sets myBookmarks on the props', () => {
    expect(result.myBookmarks).toEqual(globalState.bookmarks.myBookmarks);
  });

  it('sets myBookmarksIsLoaded on the props', () => {
    expect(result.isLoaded).toEqual(globalState.bookmarks.myBookmarksIsLoaded);
  });
});
