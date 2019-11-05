import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import * as autosize from 'autosize';

import { shallow } from 'enzyme';
import EditableText, { EditableTextProps } from '../';
import {
  CANCEL_BUTTON,
  REFRESH_BUTTON,
  REFRESH_MESSAGE,
  UPDATE_BUTTON
} from 'components/common/EditableText/constants';


describe('EditableText', () => {
  const setup = (propOverrides?: Partial<EditableTextProps>) => {
    const props = {
      editable: true,
      maxLength: 4000,
      onSubmitValue: jest.fn(),
      getLatestValue: jest.fn(),
      refreshValue: '',
      value: 'currentValue',
      ...propOverrides,
    };
    const wrapper = shallow<EditableText>(<EditableText {...props} />);
    return { props, wrapper };
  };
  const { props, wrapper } = setup();
  const instance = wrapper.instance();


  describe('componentDidUpdate', () => {

    // TODO - figure out how to spy on library
    // it('calls autosize on the text area ', () => {
    //   const autosizeSpy = jest.spyOn(autosize, 'default');
    // });

    it('sets isDisabled:true when refresh value does not equal value', () => {
      const { wrapper } = setup({
        refreshValue: 'new value',
        value: 'different value',
      });
      const instance = wrapper.instance();
      instance.setState({ inEditMode: true });
      const state = wrapper.state();
      expect(state.isDisabled).toBe(true);
    });

    it('calls focus on the text area', () => {
      // TODO - figure out how to use refs in jest
      // const textareaFocusSpy = jest.spyOn(instance.textAreaRef.current, 'focus');
      wrapper.setState({ inEditMode: true });
      // expect(textareaFocusSpy).toHaveBeenCalled();
    });
  });


  describe('exitEditMode', () => {
    it('updates the state', () => {
      instance.setState({ inEditMode: true, refreshValue: 'hello' });
      instance.exitEditMode();
      expect(wrapper.state()).toMatchObject({
        isDisabled: false,
        inEditMode: false,
        refreshValue: '',
      });
    })
  });


  describe('enterEditMode', () => {
    it('calls getLatestValue if it exists', () => {
      const { props, wrapper } = setup();
      const instance = wrapper.instance();
      const getLatestValueSpy = jest.spyOn(props, 'getLatestValue');
      instance.enterEditMode();
      expect(getLatestValueSpy).toHaveBeenCalled();
    });

    it('directly updates state if getLatestValue does not exist', () => {
      const { wrapper } = setup({ getLatestValue: null })
      const instance = wrapper.instance();
      const setStateSpy = jest.spyOn(instance, 'setState');
      instance.enterEditMode();
      expect(setStateSpy).toHaveBeenCalled();
    });
  });

  describe('refreshText', () => {
    it('updates the state', () => {
      const setStateSpy = jest.spyOn(instance, 'setState');
      instance.refreshText();
      expect(setStateSpy).toHaveBeenCalledWith({
        value: wrapper.state().refreshValue,
        isDisabled: false,
        inEditMode: true,
        refreshValue: undefined
      });
    })
  });


  // TODO - Figure out how to use refs in jest
  // describe('updateText', () => {
    // it('calls onSubmitValue', () => {
      // const onSubmitValueSpy = jest.spyOn(props, 'onSubmitValue');
      // instance.updateText();
      // expect(onSubmitValueSpy).toHaveBeenCalled();
    // })
  // });

  describe('render', () => {
    describe('not in edit mode', () => {
      beforeAll(() => {
        wrapper.setState({ inEditMode: false });
      });

      it('renders a ReactMarkdown component', () => {
        const markdown = wrapper.find(ReactMarkdown);
        expect(markdown.exists()).toBe(true);
        expect(markdown.props()).toMatchObject({ source: wrapper.state().value });
      });

      it('renders an edit link if it is editable', () => {
        const editLink = wrapper.find('.edit-link');
        expect(editLink.exists()).toBe(true);
        expect(editLink.props()).toMatchObject({
          onClick: instance.enterEditMode,
        })
      });

      it('does not render an edit link if it is not editable', () => {
        const { wrapper } = setup({ editable: false });
        const editLink = wrapper.find('.edit-link');
        expect(editLink.exists()).toBe(false);
      });
    });

    describe('in edit mode', () => {
      beforeAll(() => {
        wrapper.setState({ inEditMode: true });
      });

      it('renders a textarea ', () => {
        const textarea = wrapper.find('textarea');
        expect(textarea.exists()).toBe(true);
        expect(textarea.props()).toMatchObject({
          maxLength: props.maxLength,
          defaultValue: wrapper.state().value,
          disabled: wrapper.state().isDisabled,
        });
      });

      it('when disabled, renders the refresh message and button', () => {
        wrapper.setState({ isDisabled: true });
        const refreshMessage = wrapper.find('.refresh-message');
        expect(refreshMessage.text()).toBe(REFRESH_MESSAGE);

        const refreshButton = wrapper.find('.refresh-button');
        expect(refreshButton.text()).toMatch(REFRESH_BUTTON);
        expect(refreshButton.props()).toMatchObject({
          onClick: instance.refreshText,
        });
      });

      it('when not disabled, renders the update text button', () => {
        wrapper.setState({ isDisabled: false });
        const updateButton = wrapper.find('.update-button');
        expect(updateButton.text()).toMatch(UPDATE_BUTTON);
        expect(updateButton.props()).toMatchObject({
          onClick: instance.updateText,
        })
      });

      it('renders the cancel button', () => {
        const cancelButton = wrapper.find('.cancel-button');
        expect(cancelButton.text()).toMatch(CANCEL_BUTTON);
        expect(cancelButton.props()).toMatchObject({
          onClick: instance.exitEditMode,
        })
      });
    })
  });
});
