import * as React from 'react';

import { shallow } from 'enzyme';

import { RequestMetadataForm, mapDispatchToProps, mapStateToProps, RequestMetadataProps } from '../';
import globalState from 'fixtures/globalState';
import { NotificationType } from 'interfaces/';

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
  const setup = () => {
    const props: RequestMetadataProps = {
      userEmail: '',
      tableName: '',
      tableOwners: [''],
      submitNotification: jest.fn(),
      requestIsOpen: false,
      closeRequestDescriptionDialog: jest.fn(),
    };
    const wrapper = shallow<RequestMetadataForm>(<RequestMetadataForm {...props} />)
    return {props, wrapper}
  };

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
  
  // TODO
  describe('render', () => {
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
