import * as React from 'react';

import { shallow } from 'enzyme';

import { ResourceType } from 'components/common/ResourceListItem/types';
import ResourceListItem from 'components/common/ResourceListItem/index';
import ResourceList, { ResourceListProps } from '../.';

describe('ResourceList', () => {
  const setup = (propOverrides?: Partial<ResourceListProps>) => {
    const props: ResourceListProps = {
      resources: [
        { type: ResourceType.table },
        { type: ResourceType.user },
      ],
      startIndex: 0,
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

    it('renders unordered list', () => {
      expect(wrapper.type()).toEqual('ul');
    });

    it('renders unordered list w/ correct className', () => {
      expect(wrapper.props()).toMatchObject({
        className: 'list-group',
      });
    });

    it('renders a ResourceListItem for each resource', () => {
      const content = wrapper.find(ResourceListItem);
      expect(content.length).toEqual(props.resources.length);
    });

    it('passes correct props to each ResourceListItem', () => {
      const content = wrapper.find(ResourceListItem);
      content.forEach((contentItem, index) => {
        expect(contentItem.props()).toMatchObject({
          item: props.resources[index],
          logging: {
            source: props.source,
            index: props.startIndex + index,
          }
        })
      });
    });
  });
});
