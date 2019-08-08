import * as React from 'react';

import { shallow } from 'enzyme';

import { OpenRequestDescription, mapDispatchToProps, mapStateToProps, OpenRequestDescriptionProps } from '../';
import globalState from 'fixtures/globalState';
import { REQUEST_DESCRIPTION } from '../constants';

describe('OpenRequestDescription', () => {
  const setup = (propOverrides?: Partial<OpenRequestDescriptionProps>) => {
    const props: OpenRequestDescriptionProps = {
      requestIsOpen: false,
      toggleRequest: jest.fn(),
      ...propOverrides, 
    };
    const wrapper = shallow<OpenRequestDescription>(<OpenRequestDescription {...props} />)
    return {props, wrapper}
  };

  describe('openRequest', () => {
    it('calls toggleRequest', () => {
      const { props, wrapper } = setup();
      const toggleRequestSpy = jest.spyOn(props, 'toggleRequest');
      wrapper.instance().openRequest();
      expect(toggleRequestSpy).toHaveBeenCalled();
    });

    it('does not call toggleRequest if already open', () => {
      const { props, wrapper } = setup({requestIsOpen: true});
      const toggleRequestSpy = jest.spyOn(props, 'toggleRequest');
      wrapper.instance().openRequest();
      expect(toggleRequestSpy).not.toHaveBeenCalled();
    });
  });
  
  describe('render', () => {
    it('renders Request Description button with correct text', () => {
      const { props, wrapper } = setup();
      const toggleRequestSpy = jest.spyOn(props, 'toggleRequest');
      wrapper.instance().render();
      expect(wrapper.find('.request-description').text()).toEqual(REQUEST_DESCRIPTION);
    });
  });

  describe('mapStateToProps', () => {
    let result;
    beforeAll(() => {
      result = mapStateToProps(globalState);
    });

    it('sets requestIsOpen on the props', () => {
      expect(result.requestIsOpen).toEqual(globalState.notification.requestIsOpen);
    });
  });

  describe('mapDispatchToProps', () => {
    let dispatch;
    let result;
    beforeAll(() => {
      dispatch = jest.fn(() => Promise.resolve());
      result = mapDispatchToProps(dispatch);
    });
  
    it('sets toggleRequest on the props', () => {
      expect(result.toggleRequest).toBeInstanceOf(Function);
    });
  });
});
