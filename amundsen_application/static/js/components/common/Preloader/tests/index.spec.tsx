import * as React from 'react';
import { shallow } from 'enzyme';

import { Preloader, PreloaderProps } from '../';

describe('Preloader', () => {
  const setup = (propOverrides?: Partial<PreloaderProps>) => {
    const props: PreloaderProps = {
      getLoggedInUser: jest.fn(),
      getBookmarks: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<Preloader>(<Preloader { ...props } />);
    return { props, wrapper };
  };


  describe('componentDidMount', () => {
    it('calls props.getLoggedInUser', () => {
      const { props, wrapper } = setup();
      wrapper.instance().componentDidMount();
      expect(props.getLoggedInUser).toHaveBeenCalled();
    });


    it('calls props.getLoggedInUser', () => {
      const { props, wrapper } = setup();
      wrapper.instance().componentDidMount();
      expect(props.getBookmarks).toHaveBeenCalled();
    });
  });


  describe('render', () => {
    it('does not render any elements', () => {
      const { wrapper } = setup();
      expect(wrapper.html()).toBeFalsy();
    });
  });
});
