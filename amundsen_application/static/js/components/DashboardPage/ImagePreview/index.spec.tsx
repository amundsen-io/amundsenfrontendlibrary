import * as React from 'react';

import { shallow } from 'enzyme';

import { ImagePreview, ImagePreviewProps } from './';

import LoadingSpinner from 'components/common/LoadingSpinner';

import globalState from 'fixtures/globalState';
import { errorPreviewStateNoMessage, errorPreviewStateWithMessage } from 'fixtures/dashboard/preview';

import * as Constants from './constants';

/*describe('ImagePreview', () => {
  const setup = (propOverrides?: Partial<ImagePreviewProps>) => {
    const props = {
      uri: 'test:uri/value',
      url: 'someUrl',
      errorMessage: 'oops',
      errorCode: undefined,
      isLoading: false,
      getPreviewImage: jest.fn(),
      ...propOverrides,
    };

    const wrapper = shallow<ImagePreview>(<ImagePreview {...props} />)
    return { props, wrapper };
  };

  describe('componentDidMount', () => {
    it('triggers logic for preview image to load', () => {
      const { props, wrapper } = setup();
      expect(props.getPreviewImage).toHaveBeenCalledWith({ uri: props.uri });
    })
  })

  describe('render', () => {
    let props;
    let wrapper;
    let element;
    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      element = wrapper.find('.image-preview');
    })

    it('renders the loading spinner when loading', () => {
      const { props, wrapper } = setup({ isLoading: true })
      expect(wrapper.find(LoadingSpinner).exists()).toBeTruthy();
    });

    it('renders the error message if and error code exists', () => {
      const { props, wrapper } = setup({ errorCode: 500 })
      expect(wrapper.find('.loading-error-text').text()).toBe(props.errorMessage);
    });

    it('renders an image with expected source if no error', () => {
      expect(element.find('img').props().src).toBe(props.url);
    });
  });

  describe('mapStateToProps', () => {
    let result;
    let testState;
    beforeAll(() => {
      testState = {
        ...globalState,
      }
      result = mapStateToProps(testState);
    });

    it('sets url on the props', () => {
      expect(result.url).toEqual(testState.dashboard.preview.url);
    });

    describe('sets error properties on the props', () => {
      beforeAll(() => {
        testState = {
          ...globalState,
          dashboard: {
            ...globalState.dashboard,
            preview: errorPreviewStateWithMessage,
          }
        }
        result = mapStateToProps(testState);
      });

      it('sets errorMessage if it exists', () => {
        expect(result.errorMessage).toEqual(testState.dashboard.preview.errorMessage);
      });

      it('sets errorCode on the props', () => {
        expect(result.errorCode).toEqual(testState.dashboard.preview.errorCode);
      });

      it('uses default message errorMessage does not exist on the state', () => {
        testState = {
          ...globalState,
          dashboard: {
            ...globalState.dashboard,
            preview: errorPreviewStateNoMessage,
          }
        }
        result = mapStateToProps(testState);
        expect(result.errorMessage).toEqual(Constants.DEFAULT_ERROR_MESSAGE);
      });
    });

    it('sets isLoading on the props', () => {
      expect(result.isLoading).toEqual(testState.dashboard.preview.isLoading);
    });
  });


  describe('mapDispatchToProps', () => {
    let dispatch;
    let result;
    beforeAll(() => {
      dispatch = jest.fn(() => Promise.resolve());
      result = mapDispatchToProps(dispatch);
    });

    it('sets getPreviewImage on the props', () => {
      expect(result.getPreviewImage).toBeInstanceOf(Function);
    });
  });
});*/
