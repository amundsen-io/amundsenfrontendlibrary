import * as React from 'react';
import { mount } from 'enzyme';

import Card, { CardProps } from '.';

const setup = (propOverrides?: Partial<CardProps>) => {
  const props = {
    title: 'test title',
    ...propOverrides,
  };
  const wrapper = mount<typeof Card>(<Card {...props} />);

  return { props, wrapper };
};

describe('Card', () => {
  describe('render', () => {
    it('renders without issues', () => {
      expect(() => {
        setup();
      }).not.toThrow();
    });

    it('renders the main container', () => {
      const { wrapper } = setup();
      const expected = 1;
      const actual = wrapper.find('.card').length;

      expect(actual).toEqual(expected);
    });

    describe('header', () => {
      it('renders a header section', () => {
        const { wrapper } = setup();
        const expected = 1;
        const actual = wrapper.find('.card-header').length;

        expect(actual).toEqual(expected);
      });

      it('renders a title', () => {
        const { wrapper } = setup();
        const expected = 1;
        const actual = wrapper.find('.card-title').length;

        expect(actual).toEqual(expected);
      });

      describe('subtitle', () => {
        it('renders a subtitle if passed', () => {
          const { wrapper } = setup({ subtitle: 'test subtitle' });
          const expected = 1;
          const actual = wrapper.find('.card-subtitle').length;

          expect(actual).toEqual(expected);
        });

        it('does not render a subtitle if missing', () => {
          const { wrapper } = setup();
          const expected = 0;
          const actual = wrapper.find('.card-subtitle').length;

          expect(actual).toEqual(expected);
        });
      });
    });

    describe('body', () => {
      it('renders a body section', () => {
        const { wrapper } = setup();
        const expected = 1;
        const actual = wrapper.find('.card-body').length;

        expect(actual).toEqual(expected);
      });

      describe('copy', () => {
        it('renders a copy if passed', () => {
          const { wrapper } = setup({ copy: 'test copy' });
          const expected = 1;
          const actual = wrapper.find('.card-copy').length;

          expect(actual).toEqual(expected);
        });

        it('does not render a copy if missing', () => {
          const { wrapper } = setup();
          const expected = 0;
          const actual = wrapper.find('.card-copy').length;

          expect(actual).toEqual(expected);
        });
      });
    });

    describe('when is loading', () => {
      it('holds a loading state', () => {
        const { wrapper } = setup({ isLoading: true });
        const expected = 1;
        const actual = wrapper.find('.card.is-loading').length;

        expect(actual).toEqual(expected);
      });

      it('renders a shimmer loader', () => {
        const { wrapper } = setup({ isLoading: true });
        const expected = 1;
        const actual = wrapper.find('.card-shimmer-loader').length;

        expect(actual).toEqual(expected);
      });

      it('renders five rows of line loaders', () => {
        const { wrapper } = setup({ isLoading: true });
        const expected = 5;
        const actual = wrapper.find('.card-shimmer-row').length;

        expect(actual).toEqual(expected);
      });
    });
  });
});
