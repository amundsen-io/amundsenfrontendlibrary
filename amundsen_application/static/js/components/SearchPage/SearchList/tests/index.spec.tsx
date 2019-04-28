import * as React from 'react';

import { shallow } from 'enzyme';

import { Avatar } from 'react-avatar';
import SearchList, { SearchListProps, SearchListParams } from '../';

import ResourceListItem from 'components/common/ResourceListItem';
import { Resource, ResourceType } from 'components/common/ResourceListItem/types';

describe('SearchList', () => {
  const setup = (propOverrides?: Partial<SearchListProps>) => {
    const props: SearchListProps = {
      results: [
        { type: ResourceType.table },
        { type: ResourceType.user },
      ],
      params: {
        source: 'testSource',
        paginationStartIndex: 0,
      },
      ...propOverrides
    };
    const wrapper = shallow(<SearchList {...props} />)
    return { props, wrapper }
  };

  describe('render', () => {
    let props;
    let wrapper;
    beforeAll(() => {
      /* Note: { props, wrapper } = setup() is not working as expected */
      const result = setup();
      props = result.props;
      wrapper = result.wrapper;
    });

    it('renders unordered list', () => {
      expect(wrapper.type()).toEqual('ul');
    });

    it('renders unordered list w/ correct className', () => {
      expect(wrapper.props()).toMatchObject({
        className: 'list-group',
      });
    });

    it('renders a ResourceListItem for each result', () => {
      const content = wrapper.find(ResourceListItem);
      expect(content.length).toEqual(props.results.length);
    });

    it('passes correct props to each ResourceListItem', () => {
      const content = wrapper.find(ResourceListItem);
      content.forEach((contentItem, index) => {
        expect(contentItem.props()).toMatchObject({
          item: props.results[index],
          logging: {
            source: props.params.source,
            index: props.params.paginationStartIndex + index,
          }
        })
      });
    });
  });
});
