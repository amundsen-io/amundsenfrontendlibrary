import * as React from 'react';
import Pagination from 'react-js-pagination';

import { shallow } from 'enzyme';

import { ResourceType } from 'interfaces';
import ResourceListItem from 'components/common/ResourceListItem/index';
import ResourceList, { ResourceListProps } from '../';

describe('ResourceList', () => {
  const setup = (propOverrides?: Partial<ResourceListProps>) => {
    const props: ResourceListProps = {
      paginate: true,
      source: 'testSource',
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
      ...propOverrides
    };
    const wrapper = shallow<ResourceList>(<ResourceList {...props} />);
    return { props, wrapper };
  };

  describe('render with no pagination', () => {
    let props;
    let wrapper;
    beforeAll(() => {
      const setupResult = setup({ paginate: false });
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    it('should render all items', () => {
      const items = wrapper.find(ResourceListItem);
      expect(items.length).toEqual(props.items.length);
    });

  });

  describe('render with pagination', () => {
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

    it('Renders a pagination widget when there are more than ITEMS_PER_PAGE items', () => {
      expect(wrapper.find(Pagination).exists()).toBe(true)
    });

    it('Hides a pagination widget when there are fewer than ITEMS_PER_PAGE items', () => {
      const { props, wrapper } = setup({
        items: [{ type: ResourceType.table }],
      });
      expect(wrapper.find(Pagination).exists()).toBe(false)
    });
  });

  describe('onPagination', () => {
    it('calls the "onPagination" prop when it exists', () => {
      const setupResult = setup();
      const wrapper = setupResult.wrapper;
      const props = setupResult.props;
      const onPaginationSpy = jest.spyOn(props, 'onPagination');

      wrapper.instance().onPagination(3);
      expect(onPaginationSpy).toHaveBeenCalledWith(2);
    });

    it('calls "setState" when "onPagination" prop does not exist', () => {
      const setStateSpy = jest.spyOn(ResourceList.prototype, 'setState');
      const setupResult = setup({ onPagination: undefined });
      const wrapper = setupResult.wrapper;
      wrapper.instance().onPagination(3);
      expect(setStateSpy).toHaveBeenCalledWith({ activePage: 2 });
    });
  });
});
