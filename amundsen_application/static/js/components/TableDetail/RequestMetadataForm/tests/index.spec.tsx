import * as React from 'react';
import { shallow } from 'enzyme';

import globalState from 'fixtures/globalState';
import { NotificationType } from 'interfaces/';
import { RequestMetadataForm, mapDispatchToProps, mapStateToProps, RequestMetadataProps } from '../';
import {
  TITLE_TEXT,
  FROM_LABEL,
  TO_LABEL,
  REQUEST_TYPE,
  TABLE_DESCRIPTION,
  COLUMN_DESCRIPTIONS,
  ADDITIONAL_DETAILS,
  SEND_BUTTON,
} from '../constants'

const mockFormData = {
  'recipients': 'test1@test.com,test2@test.com',
  'sender': 'test@test.com',
  'table-description': 'on',
  'fields-requested': 'off',
  'comment': 'test',
  get: jest.fn(),
}
mockFormData.get.mockImplementation((val) => {
  return mockFormData[val];
})
// @ts-ignore: How to mock FormData without TypeScript error?
global.FormData = () => (mockFormData);

describe('RequestMetadataForm', () => {
  const setup = (propOverrides?: Partial<RequestMetadataProps>) => {
    const props: RequestMetadataProps = {
      userEmail: 'test0@lyft.com',
      tableName: '',
      tableOwners: ['test1@lyft.com', 'test2@lyft.com'],
      submitNotification: jest.fn(),
      requestIsOpen: true,
      closeRequestDescriptionDialog: jest.fn(),
      ...propOverrides,
    };
    const wrapper = shallow<RequestMetadataForm>(<RequestMetadataForm {...props} />);
    return {props, wrapper}
  };

  describe('componentWillUnmount', () => {
    it('calls closeRequestDescriptionDialog', () => {
      const { props, wrapper } = setup();
      const closeRequestDescriptionDialogSpy = jest.spyOn(props, 'closeRequestDescriptionDialog');
      wrapper.instance().componentWillUnmount();
      expect(closeRequestDescriptionDialogSpy).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('calls closeRequestDescriptionDialog', () => {
      const { props, wrapper } = setup();
      const closeRequestDescriptionDialogSpy = jest.spyOn(props, 'closeRequestDescriptionDialog');
      wrapper.instance().closeDialog();
      expect(closeRequestDescriptionDialogSpy).toHaveBeenCalled();
    });
  });

  describe('submitNotification', () => {
    it('calls submitNotification', () => {
      const { props, wrapper } = setup();
      const submitNotificationSpy = jest.spyOn(props, 'submitNotification');
      wrapper.instance().submitNotification({ preventDefault: jest.fn() });
      expect(submitNotificationSpy).toHaveBeenCalledWith(
        mockFormData['recipients'].split(','),
        mockFormData['sender'],
        NotificationType.REQUESTED,
        {
          comment: mockFormData['comment'],
          resource_name: props.tableName,
          resource_url: window.location.href,
          description_requested: true,
          fields_requested: false,
        }
      );
    });
  });

  describe('render', () => {
    let props;
    let wrapper;
    let element;

    describe('when this.props.requestIsOpen', () => {
      beforeAll(() => {
        const setupResult = setup();
        props = setupResult.props;
        wrapper = setupResult.wrapper;
      });
      it('renders header title', () => {
        element = wrapper.find('#request-metadata-title');
        expect(element.find('h3').text()).toEqual(TITLE_TEXT);
      });
      it('renders close button', () => {
        element = wrapper.find('#request-metadata-title');
        expect(element.find('button').exists()).toEqual(true);
      });

      it('renders from input with current user', () => {
        element = wrapper.find('#sender-form-group');
        expect(element.find('input').props().value).toEqual('test0@lyft.com');
      });

      it('renders from label', () => {
        element = wrapper.find('#sender-form-group');
        expect(element.find('label').text()).toEqual(FROM_LABEL);
      });
      it('renders from input with current user', () => {
        element = wrapper.find('#sender-form-group');
        expect(element.find('input').props().value).toEqual('test0@lyft.com');
      });

      it('renders to label', () => {
        element = wrapper.find('#recipients-form-group');
        expect(element.find('label').text()).toEqual(TO_LABEL);
      });
      it('renders to input with correct recipients', () => {
        element = wrapper.find('#recipients-form-group');
        expect(element.find('input').props().defaultValue).toEqual('test1@lyft.com,test2@lyft.com');
      });

      it('renders request type label', () => {
        element = wrapper.find('#request-type-form-group');
        expect(element.find('label').at(0).text()).toEqual(REQUEST_TYPE);
      });
      it('renders table description checkbox', () => {
        element = wrapper.find('#request-type-form-group');
        expect(element.find('label').at(1).text()).toEqual(TABLE_DESCRIPTION);
      });
      it('renders column descriptions checkbox', () => {
        element = wrapper.find('#request-type-form-group');
        expect(element.find('label').at(2).text()).toEqual(COLUMN_DESCRIPTIONS);
      });

      it('renders additional details label', () => {
        element = wrapper.find('#additional-comments-form-group');
        expect(element.find('label').text()).toEqual(ADDITIONAL_DETAILS);
      });
      it('renders empty textarea', () => {
        element = wrapper.find('#additional-comments-form-group');
        expect(element.find('textarea').text()).toEqual('');
      });

      it('renders submit button with correct text', () => {
        element = wrapper.find('#submit-request-button');
        expect(element.text()).toEqual(SEND_BUTTON);
      });
    });

    describe('when !this.props.requestIsOpen', () => {
      beforeAll(() => {
        const setupResult = setup({ requestIsOpen: false });
        props = setupResult.props;
        wrapper = setupResult.wrapper;
      });

      it('renders nothing', () => {
        expect(wrapper).toEqual({});
      });
    });
  });

  describe('mapStateToProps', () => {
    let result;
    beforeAll(() => {
      result = mapStateToProps(globalState);
    });

    it('sets userEmail on the props', () => {
      expect(result.userEmail).toEqual(globalState.user.loggedInUser.email);
    });
    it('sets tableName on the props', () => {
      expect(result.tableName).toEqual(globalState.tableMetadata.tableData.schema + '.' + globalState.tableMetadata.tableData.table_name);
    });
    it('sets ownerObj on the props', () => {
      expect(result.tableOwners).toEqual(Object.keys(globalState.tableMetadata.tableOwners.owners));
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

    it('sets submitNotification on the props', () => {
      expect(result.submitNotification).toBeInstanceOf(Function);
    });

    it('sets closeRequestDescriptionDialog on the props', () => {
      expect(result.closeRequestDescriptionDialog).toBeInstanceOf(Function);
    });
  });
});
