import * as React from 'react';
import { shallow } from 'enzyme';

import Flag from 'components/common/Flag';
import { ClickableBadge, ClickableBadgeProps, mapDispatchToProps } from '.';
import { BadgeStyle } from 'config/config-types';
import { updateSearchState } from 'ducks/search/reducer';
import * as UtilMethods from 'ducks/utilMethods';


const logClickSpy = jest.spyOn(UtilMethods, 'logClick');
logClickSpy.mockImplementation(() => null);

jest.mock('ducks/search/reducer', () => ({
  updateSearchState: jest.fn(),
}));

describe('ClickableBadge', () => {
  const setup = (propOverrides?: Partial<ClickableBadgeProps>) => {
    const props = {
        text: 'test_badge',
        labelStyle: BadgeStyle.PRIMARY,
        searchBadge: jest.fn(),
        ...propOverrides,
    };
    const wrapper = shallow(<ClickableBadge {...props} />);
    return { props, wrapper };
  };

  describe('onClick', () => {
    let props;
    let wrapper;
    const mockEvent = {};

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    it('Calls the logClick utility function', () => {
      logClickSpy.mockClear();
      const expectedData = {
        target_type: 'badge',
        label: props.text,
      };
      wrapper.instance().onClick(mockEvent);
      expect(logClickSpy).toHaveBeenCalledWith(mockEvent, expectedData);
    });

    it('it calls searchBadge', () => {
      wrapper.instance().onClick(mockEvent);
      expect(props.searchBadge).toHaveBeenCalledWith(props.text);
    });
  });

  describe('render', () => {
      let props;
      let wrapper;

      beforeAll(() => {
        const setupResult = setup();
        wrapper = setupResult.wrapper;
        props = setupResult.props;
      });

      it('renders a <Flag> for the ClickableBadge', () => {
        const flag_per_badge = 1;
        expect(wrapper.find(Flag).length).toEqual(flag_per_badge);
      });

      it('renders with correct text', () => {
        expect(wrapper.find(Flag).props().text).toEqual(props.text);
      });
    //   TODO look into why no className defined for Flag in this case
    //   it('renders Flag with correct classes', () => {
    //     expect(wrapper.find(Flag).props().className).toEqual(
    //         `flag label label-${props.labelStyle}`
    //     );
      });
    });
  });
describe('mapDispatchToProps', () => {
  let dispatch;
  let result;
  beforeAll(() => {
    dispatch = jest.fn(() => Promise.resolve());
    result = mapDispatchToProps(dispatch);
  });

  it('sets searchBadge on the props to trigger desired action', () => {
    result.searchBadge();
    expect(updateSearchState).toHaveBeenCalled();
  });
});