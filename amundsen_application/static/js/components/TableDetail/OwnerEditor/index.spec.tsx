import * as React from 'react';

import { shallow } from 'enzyme';

import globalState from 'fixtures/globalState';
import AvatarLabel from 'components/common/AvatarLabel';

import {
  OwnerEditor,
  OwnerEditorProps,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

describe('OwnerEditor', () => {
  const setup = (propOverrides?: Partial<OwnerEditorProps>) => {
    const props: OwnerEditorProps = {
      errorText: null,
      isLoading: false,
      itemProps: {},
      isEditing: null,
      setEditMode: jest.fn(),
      onUpdateList: jest.fn(),
      readOnly: null,
      ...propOverrides,
    };
    const wrapper = shallow<OwnerEditor>(<OwnerEditor {...props} />);
    return { props, wrapper };
  };

  describe('render', () => {
    it('renders text if no owners', () => {
      const { wrapper } = setup({ itemProps: {} });
      expect(wrapper.find('.owner-editor-component').text()).toContain(
        'No owners exist'
      );
    });

    it('does not render Add Owner button if component is readOnly', () => {
      const { wrapper } = setup({ itemProps: {}, readOnly: true });
      expect(wrapper.find('.owner-editor-component').text()).toEqual(
        'No owners exist<Modal />'
      );
    });

    it('renders owners if they exist', () => {
      const { wrapper } = setup({
        itemProps: { owner1: {} },
      });
      expect(
        wrapper.find('.owner-editor-component').find(AvatarLabel).exists()
      ).toBe(true);
    });
  });

  describe('mapDispatchToProps', () => {
    let dispatch;
    let props;

    beforeAll(() => {
      dispatch = jest.fn(() => Promise.resolve());
      props = mapDispatchToProps(dispatch);
    });

    it('sets onUpdateList on the props', () => {
      expect(props.onUpdateList).toBeInstanceOf(Function);
    });
  });

  describe('mapStateToProps', () => {
    let result;
    const ownProps = { readOnly: true };
    beforeAll(() => {
      result = mapStateToProps(globalState, ownProps);
    });

    it('sets isLoading on the props', () => {
      expect(result.isLoading).toEqual(
        globalState.tableMetadata.tableOwners.isLoading
      );
    });

    it('sets readOnly on the props', () => {
      expect(result.readOnly).toEqual(ownProps.readOnly);
    });
  });
});
