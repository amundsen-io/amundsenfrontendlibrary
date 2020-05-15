import * as React from 'react';
import { shallow } from 'enzyme';

import ShimmeringDashboardLoader from './';

const setup = () => {
  const wrapper = shallow(<ShimmeringDashboardLoader />);

  return wrapper;
};

describe('ShimmeringDashboardLoader', () => {
  describe('render', () => {
    it('should render without errors', () => {
      expect(() => {setup()}).not.toThrow();
    });

    it('should render three rows', () => {
      let expected = 3;
      let actual = setup().find('.shimmer-loader-row').length;

      expect(actual).toEqual(expected);
    });

    it('should render six cells', () => {
      let expected = 6;
      let actual = setup().find('.shimmer-loader-cell').length;

      expect(actual).toEqual(expected);
    });
  });
});
