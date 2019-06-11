import * as React from 'react';
import Pagination from 'react-js-pagination';

import { shallow } from 'enzyme';

import { ResourceType } from 'interfaces';
import ResourceListItem from 'components/common/ResourceListItem/index';
import ResourceList, { ResourceListProps } from '../';

describe('ResourceList', () => {
  const setup = (propOverrides?: Partial<ResourceListProps>) => {
    const props: ResourceListProps = {
      activePage: 0,
      isFullList: true,
      items: [
        { type: ResourceType.table },
        { type: ResourceType.table },
        { type: ResourceType.table },
        { type: ResourceType.table },
        { type: ResourceType.table },
        { type: ResourceType.user },
      ],
      itemsPerPage: 4,
      onPagination: jest.fn(),
      source: 'testSource',
      ...propOverrides
    };
    const wrapper = shallow(<ResourceList {...props} />);
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

    it('renders at most "itemsPerPage" ResourceListItems', () => {
      const content = wrapper.find(ResourceListItem);
      expect(content.length).toEqual(props.itemsPerPage);
    });

    it('passes correct props to each ResourceListItem', () => {
      const content = wrapper.find(ResourceListItem);

      const startIndex = props.activePage * props.itemsPerPage;

      content.forEach((contentItem, index) => {
        expect(contentItem.props()).toMatchObject({
          item: props.items[index],
          logging: {
            source: props.source,
            index: startIndex + index,
          }
        })
      });
    });

    it('Renders a pagination widget when there are more than ITEMS_PER_PAGE bookmarks', () => {
      expect(wrapper.find(Pagination).exists()).toBe(true)
    });

    it('Hides a pagination widget when there are fewer than ITEMS_PER_PAGE bookmarks', () => {
      const { props, wrapper } = setup({
        items: [{ type: ResourceType.table }],
      });
      expect(wrapper.find(Pagination).exists()).toBe(false)
    });

  });
});
