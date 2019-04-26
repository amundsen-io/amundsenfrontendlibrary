import * as React from 'react';

import { shallow } from 'enzyme';

import { Avatar } from 'react-avatar';
import SearchList, { SearchListProps, generateListItems } from '../';

import ResourceListItem from 'components/common/ResourceListItem';
import { Resource, ResourceType } from 'components/common/ResourceListItem/types';

describe('SearchList', () => {
    const setup = (propOverrides: Partial<SearchListProps>) => {
      const props: SearchListProps = {
        results: [],
        params: {},
        ...propOverrides
      };
      const wrapper = shallow(<SearchList {...props} />)
      return { props, wrapper }
    };

    describe('generateListItems', () => {
        let content;
        const resourceList: Resource[] = [
          { type: ResourceType.table },
          { type: ResourceType.user },
        ];
        const params: SearchListParams = {
          source: 'testSource',
          paginationStartIndex: 0,
        };
        beforeEach(() => {
            content = generateListItems(resourceList, params);
        });

        it('returns a ResourceListItem for each result', () => {
            content.forEach((contentItem) => {
              expect(shallow(contentItem).instance()).toBeInstanceOf(ResourceListItem);
            });
        });

        it('passes correct props to each ResourceListItem', () => {
            /*
              Note about [resourceList[index].type]: Subclasses of ResourceListItem have different prop names that curretly map to their type.
              For example, Jest is recognizing the the 'item' prop of ResourceListItem as 'table' if it is a TableListItem.
            */
            content.forEach((contentItem, index) => {
              expect(shallow(contentItem).props()).toMatchObject({
                [resourceList[index].type]: resourceList[index],
                logging: {
                  source: params.source,
                  index: params.paginationStartIndex + index,
                }
              })
            });
        });
    });

    describe('render', () => {
        beforeEach(() => {
            generateListItems = jest.fn();
        });

        it('renders unordered list', () => {
            const { props, wrapper } = setup();
            expect(wrapper.type()).toEqual('ul');
        });

        it('renders unordered list w/ correct className', () => {
            const { props, wrapper } = setup();
            expect(wrapper.props()).toMatchObject({
              className: 'list-group',
            })
        });

        it('call generateListItems with correct props', () => {
            const { props, wrapper } = setup();
            expect(generateListItems).toHaveBeenCalledWith(props.results, props.params);
        });

        afterEach(() => {
            generateListItems.mockRestore();
        });
    });
});
