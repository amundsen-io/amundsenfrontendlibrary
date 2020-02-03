import * as React from 'react';
import { shallow } from 'enzyme';

import { CheckBoxFilter, CheckBoxFilterProps, mapDispatchToProps } from '../';
import CheckBoxItem from 'components/common/Inputs/CheckBoxItem';

import { clearFilterByCategory, updateFilterByCategory } from 'ducks/search/filters/reducer';

describe('CheckBoxFilter', () => {
  const setup = (propOverrides?: Partial<CheckBoxFilterProps>) => {
    const props: CheckBoxFilterProps = {
      categoryId: 'database',
      checkboxProperties: [
        {
          checked: false,
          labelText: 'BigQuery',
          value: 'bigquery'
        },
        {
          checked: true,
          labelText: 'Hive',
          value: 'hive'
        }
      ],
      onCheckboxChange: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<CheckBoxFilter>(<CheckBoxFilter {...props} />);
    return { props, wrapper };
  };

  describe('createCheckBoxItem', () => {
    const mockCategoryId = 'categoryId';
    let props;
    let wrapper;

    let checkBoxItem;
    let mockProperties;
    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      mockProperties = props.checkboxProperties[0];
      const content = wrapper.instance().createCheckBoxItem(mockCategoryId, 'testKey', mockProperties);
      checkBoxItem = shallow(<div>{content}</div>).find(CheckBoxItem);
    })

    it('returns a CheckBoxItem', () => {
      expect(checkBoxItem.exists()).toBe(true);
    });

    it('returns a CheckBoxItem with correct props', () => {
      const itemProps = checkBoxItem.props()
      expect(itemProps.checked).toBe(mockProperties.checked);
      expect(itemProps.name).toBe(mockCategoryId);
      expect(itemProps.value).toBe(mockProperties.value);
      expect(itemProps.onChange).toBe(props.onCheckboxChange)
    });

    it('returns a CheckBoxItem with correct labelText as child', () => {
      expect(checkBoxItem.children().text()).toBe(mockProperties.labelText)
    });
  });

  describe('render', () => {
    let props;
    let wrapper;
    let createCheckBoxItemSpy;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      createCheckBoxItemSpy = jest.spyOn(wrapper.instance(), 'createCheckBoxItem');
      wrapper.instance().render();
    })
    it('calls createCheckBoxItem with correct parameters for each props.checkboxProperties', () => {
      props.checkboxProperties.forEach((item, index) => {
        expect(createCheckBoxItemSpy).toHaveBeenCalledWith(props.categoryId, `item:${props.categoryId}:${index}`,item)
      })
    })
  });

  describe('mapDispatchToProps', () => {
    const dispatchMock = jest.fn();
    const mockCategoryId = 'database';
    const mockValue = 'hive';
    let result;
    let ownProps: CheckBoxFilterProps;
    let testProps: Partial<CheckBoxFilterProps>;
    let mockEvent;

    describe('sets onCheckboxChange on the props', () => {
      it('to clearfilters if no value will be checked due to the change', () => {
        testProps = {
          categoryId: mockCategoryId,
          checkboxProperties: [
            {
              checked: true,
              labelText: 'Hive',
              value: mockValue
            }
          ],
        };
        mockEvent = { target: { name: mockCategoryId, value: mockValue, checked: false }};
        ownProps = setup(testProps).props;
        dispatchMock.mockClear();
        result = mapDispatchToProps(dispatchMock, ownProps);
        result.onCheckboxChange(mockEvent);
        expect(dispatchMock).toHaveBeenCalledWith(clearFilterByCategory(mockCategoryId));
      })

      it('to update filters for a given category if values will be checked due to the change', () => {
        testProps = {
          categoryId: mockCategoryId,
          checkboxProperties: [
            {
              checked: true,
              labelText: 'BigQuery',
              value: 'bigquery'
            },
            {
              checked: false,
              labelText: 'Hive',
              value: mockValue
            }
          ],
        };
        mockEvent = { target: { name: mockCategoryId, value: mockValue, checked: true }};
        ownProps = setup(testProps).props;
        dispatchMock.mockClear();
        result = mapDispatchToProps(dispatchMock, ownProps);
        result.onCheckboxChange(mockEvent);
        expect(dispatchMock).toHaveBeenCalledWith(updateFilterByCategory(mockCategoryId, { [mockValue]: true, 'bigquery': true }));
      })
    });
  });
});
