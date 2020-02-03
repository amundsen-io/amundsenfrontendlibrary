import * as React from 'react';
import { shallow } from 'enzyme';

import { clearFilterByCategory } from 'ducks/search/filters/reducer';

import { FilterSection, FilterSectionProps, mapDispatchToProps } from '../';

import InfoButton from 'components/common/InfoButton';
import { CLEAR_BTN_TEXT } from '../../constants';

describe('FilterSection', () => {
  const setup = (propOverrides?: Partial<FilterSectionProps>) => {
    const props: FilterSectionProps = {
      categoryId: 'testId',
      hasValue: true,
      title: 'Category',
      onClearFilter: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<FilterSection>(<FilterSection {...props} />);
    return { props, wrapper };
  };

  describe('render', () => {
    let props;
    let wrapper;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    })

    it('renders FilterSection title', () => {
      expect(wrapper.find('.title-2').text()).toEqual(props.title);
    })

    it('renders InfoButton with correct props if props.helpText exists', () => {
      const mockHelpText = 'Help me';
      const wrapper = setup({ helpText: mockHelpText }).wrapper;
      const infoButton = wrapper.find(InfoButton);
      expect(infoButton.exists()).toBe(true);
      expect(infoButton.props().infoText).toBe(mockHelpText)
    })

    it('renders link to clear category if props.hasValue', () => {
      const { props, wrapper } = setup({ hasValue: true });
      const clearLink = wrapper.find('a');
      expect(clearLink.exists()).toBe(true);
      expect(clearLink.props().onClick).toBe(props.onClearFilter);
      expect(clearLink.text()).toEqual(CLEAR_BTN_TEXT)
    })
  });

  describe('mapDispatchToProps', () => {
    const dispatchMock = jest.fn();
    let result;
    let ownProps: FilterSectionProps;

    describe('sets onClearFilter on the props', () => {
      it('to clearfilter for ownProps.categoryId ', () => {
        ownProps = setup().props;
        dispatchMock.mockClear();
        result = mapDispatchToProps(dispatchMock, ownProps);
        result.onClearFilter();
        expect(dispatchMock).toHaveBeenCalledWith(clearFilterByCategory(ownProps.categoryId));
      })
    });
  });
});
