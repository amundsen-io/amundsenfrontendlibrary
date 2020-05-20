import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { shallow } from 'enzyme';

import Linkify from 'react-linkify'

import { ImagePreview, ImagePreviewProps } from './';

import ShimmeringDashboardLoader from '../ShimmeringDashboardLoader';

import * as Constants from './constants';

describe('ImagePreview', () => {
  const setup = (propOverrides?: Partial<ImagePreviewProps>) => {
    const props = {
      uri: 'test:uri/value',
      redirectUrl: 'someUrl',
      ...propOverrides,
    };

    const wrapper = shallow<ImagePreview>(<ImagePreview {...props} />)
    return { props, wrapper };
  };

  describe('onSuccess', () => {
    let currentState;
    beforeAll(() => {
      const { props, wrapper } = setup();
      wrapper.instance().onSuccess();
      currentState = wrapper.state();
    });
    it('sets the loading state to false', () => {
      expect(currentState.isLoading).toBe(false);
    });
    it('sets the hasError state to false', () => {
      expect(currentState.hasError).toBe(false);
    })
  });

  describe('onError', () => {
    let currentState;
    beforeAll(() => {
      const { props, wrapper } = setup();
      const event = {} as React.SyntheticEvent<HTMLImageElement>;
      wrapper.instance().onError(event);
      currentState = wrapper.state();
    });
    it('sets the loading state to false', () => {
      expect(currentState.isLoading).toBe(false);
    });
    it('sets the hasError state to false', () => {
      expect(currentState.hasError).toBe(true);
    })
  });

  describe('render', () => {
    describe('if no error', () => {
      describe('when loading', () => {
        let wrapper;
        beforeAll(() => {
          wrapper = setup().wrapper;
          wrapper.instance().setState({ isLoading: true, hasError: false });
        });

        it('renders the loading dashboard', () => {
          expect(wrapper.find(ShimmeringDashboardLoader).exists()).toBeTruthy();
        });

        it('renders hidden img', () => {
          expect(wrapper.find('img').props().style).toEqual({ visibility: 'hidden' });
        });
      });

      describe('when loaded', () => {
        let props;
        let wrapper;

        beforeAll(() => {
          const setupResult = setup();
          props = setupResult.props
          wrapper = setupResult.wrapper;
          wrapper.instance().setState({ isLoading: false, hasError:false });
        });

        it('renders visible img with correct props', () => {
          const elementProps = wrapper.find('img').props();
          expect(elementProps.style).toEqual({ visibility: 'visible' });
          expect(elementProps.src).toEqual(`${Constants.PREVIEW_BASE}/${props.uri}/${Constants.PREVIEW_END}`);
          expect(elementProps.onLoad).toBe(wrapper.instance().onSuccess);
          expect(elementProps.onError).toBe(wrapper.instance().onError);
        });

        describe('tooltip', () => {
          it('renders an overlay trigger', () => {
            const expected = 1;
            const actual = wrapper.find(OverlayTrigger).length;

            expect(actual).toEqual(expected);
          });

          it('renders an overlay trigger placed top', () => {
            const expected = "top";
            const actual = wrapper.find(OverlayTrigger).props().placement;

            expect(actual).toEqual(expected);
          });

          it('renders an tooltip insde the overlay trigger', () => {
            const expected = Popover;
            const actual = wrapper.find(OverlayTrigger).props().overlay.type;

            expect(actual).toEqual(expected);
          });
        });
      })
    });

    it('renders link if hasError', () => {
      const { props, wrapper } = setup();
      wrapper.instance().setState({ hasError: true });
      expect(wrapper.find(Linkify).exists()).toBeTruthy();
    });
  });

  describe('lifecycle', () => {
    let wrapper;
    let props;

    describe('when clicking on the dashboard preview image', () => {

      beforeAll(() => {
        const setupResult = setup();
        props = setupResult.props
        wrapper = setupResult.wrapper;
        wrapper.instance().setState({ isLoading: false, hasError:false });
      });

      it('should open a modal', () => {

      });
    });
  });
});
