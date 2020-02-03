import * as React from 'react';
import { shallow } from 'enzyme';

import { InputFilter, InputFilterProps, mapDispatchToProps } from '../';

import { APPLY_BTN_TEXT } from '../../constants';

import { clearFilterByCategory, updateFilterByCategory } from 'ducks/search/filters/reducer';

describe('InputFilter', () => {
  const setStateSpy = jest.spyOn(InputFilter.prototype, 'setState');

  const setup = (propOverrides?: Partial<InputFilterProps>) => {
    const props: InputFilterProps = {
      categoryId: 'schema',
      value: 'schema_name',
      onApplyChanges: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<InputFilter>(<InputFilter {...props} />);
    return { props, wrapper };
  };

  describe('constructor', () => {
    const testValue = 'test';
    let wrapper;
    beforeAll(() => {
      wrapper = setup({ value: testValue }).wrapper;
    });
    it('sets the value state from props', () => {
      expect(wrapper.state().value).toEqual(testValue);
    });
  });

  describe('componentDidUpdate', () => {
    let props;
    let wrapper;
    beforeAll(() => {
       const setupResult = setup();
       props = setupResult.props;
       wrapper = setupResult.wrapper;
    });
    it('sets the value state to props.value if the property has changed', () => {
      setStateSpy.mockClear()
      const newProps = {
        ...props,
        value: 'Some new value',
      };
      wrapper.setProps(newProps);
      expect(setStateSpy).toHaveBeenCalledWith({ value: newProps.value });
    });

    it('sets the value state to empty string if the property has change and is not truthy', () => {
      setStateSpy.mockClear()
      const newProps = {
        ...props,
        value: '',
      };
      wrapper.setProps(newProps);
      expect(setStateSpy).toHaveBeenCalledWith({ value: '' });
    });

    it('does not call set state if props.value has not changed', () => {
      wrapper.setProps(props);
      setStateSpy.mockClear();
      wrapper.setProps(props);
      expect(setStateSpy).not.toHaveBeenCalled();
    });
  });

  describe('onApplyChanges', () => {
    let props;
    let wrapper;
    beforeAll(() => {
       const setupResult = setup();
       props = setupResult.props;
       wrapper = setupResult.wrapper;
    });
    it('calls props.onApplyChanges with correct parameters', () => {
      wrapper.instance().onApplyChanges({ preventDefault: jest.fn() });
      expect(props.onApplyChanges).toHaveBeenCalledWith(props.categoryId, wrapper.state().value)
    });
  });

  describe('onInputChange', () => {
    let props;
    let wrapper;
    beforeAll(() => {
       const setupResult = setup();
       props = setupResult.props;
       wrapper = setupResult.wrapper;
    });
    it('sets the value state to e.target.value', () => {
      setStateSpy.mockClear()
      const mockValue = 'mockValue';
      const mockEvent = { target: { value: mockValue }};
      wrapper.instance().onInputChange(mockEvent)
      expect(setStateSpy).toHaveBeenCalledWith({ value: mockValue });
    });
  });

  describe('render', () => {
    let props;
    let wrapper;
    let element;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      wrapper.instance().render();
    })

    it('renders a form with correct onSubmit property', () => {
      element = wrapper.find('form');
      expect(element.props().onSubmit).toBe(wrapper.instance().onApplyChanges);
    });

    it('renders and input text with correct properties', () => {
      element = wrapper.find('input');
      expect(element.props().name).toBe(props.categoryId);
      expect(element.props().onChange).toBe(wrapper.instance().onInputChange);
      expect(element.props().value).toBe(wrapper.state().value);
    });

    it('renders a button with correct properties', () => {
      element = wrapper.find('button');
      expect(element.props().name).toBe(props.categoryId);
      expect(element.text()).toEqual(APPLY_BTN_TEXT);
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatchMock = jest.fn();
    const mockCategoryId = 'column';
    let result;

    beforeAll(() => {
      result = mapDispatchToProps(dispatchMock);
    })

    describe('sets onApplyChanges on the props', () => {
      it('to clearfilters if no value is falsy', () => {
        dispatchMock.mockClear();
        result.onApplyChanges(mockCategoryId, '')
        expect(dispatchMock).toHaveBeenCalledWith(clearFilterByCategory(mockCategoryId));
      })

      it('to update filters for a given category if value exists', () => {
        const mockValue = 'column_name';
        dispatchMock.mockClear();
        result.onApplyChanges(mockCategoryId, mockValue);
        expect(dispatchMock).toHaveBeenCalledWith(updateFilterByCategory(mockCategoryId, mockValue));
      })
    });
  });
});
