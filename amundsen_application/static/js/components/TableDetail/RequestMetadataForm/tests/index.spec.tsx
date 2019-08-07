import * as React from 'react';

import { shallow } from 'enzyme';

import AbstractFeedbackForm, { FeedbackFormProps } from 'components/Feedback/FeedbackForm';
import { RequestMetadataForm, mapDispatchToProps, mapStateToProps, RequestMetadataProps } from '../';
import {
  TITLE_TEXT,
  FROM,
  TO,
  REQUEST_TYPE,
  TABLE_DESCRIPTION,
  COLUMN_DESCRIPTIONS,
  ADDITIONAL_DETAILS,
  SEND_BUTTON,
} from 'components/TableDetail/RequestMetadataForm/constants'
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
      toggleRequest: jest.fn(),
    };
    const wrapper = shallow<RequestMetadataForm>(<RequestMetadataForm {...props} />)
    return {props, wrapper}
  };

  describe('toggle', () => {
    it('calls toggleRequest', () => {
      const { props, wrapper } = setup();
      const toggleRequestSpy = jest.spyOn(props, 'toggleRequest');
      wrapper.instance().toggle();
      expect(toggleRequestSpy).toHaveBeenCalled();
    });
  });

  // TODO
  describe('submitForm', () => {
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
          description_requested: mockFormData['table-description'] === "on" ? true : false,
          fields_requested: mockFormData['fields-requested'] === "on" ? true : false,
        }
      );
    });
  });
  
  // TODO
  describe('render', () => {
  });

  // TODO
  describe('mapStateToProps', () => {
    let result;
    beforeAll(() => {
      result = mapStateToProps(globalState);
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
  
    it('sets toggleRequest on the props', () => {
      expect(result.toggleRequest).toBeInstanceOf(Function);
    });
  });
});

//   describe('render', () => {
//     let wrapper;
//     let form;
//     beforeAll(() => {
//       wrapper = setup();
//     });
//   });
// });
