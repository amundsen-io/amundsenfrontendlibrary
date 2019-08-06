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


describe('RequestMetadataForm', () => {
  const setup = () => {
    const props: RequestMetadataProps = {
      userEmail: '',
      tableName: '',
      tableOwners: [''],
      submitNotification: jest.fn(),
      requestIsOpen: false,
      openRequest: jest.fn(),
    };
    const wrapper = shallow<RequestMetadataForm>(<RequestMetadataForm {...props} />)
    return {props, wrapper}
  };
});

  // describe('toggle', () => {
  //   it('calls setState with negation of state.isOpen', () => {
  //     const setStateSpy = jest.spyOn(RequestMetadataForm.prototype, 'setState');
  //     const { props, wrapper } = setup();
  //     const isOpenState = wrapper.state().isOpen;
  //     wrapper.instance().toggle();
  //     expect(setStateSpy).toHaveBeenCalledWith({ isOpen: !isOpenState });
  //   });
  // });

//   describe('render', () => {
//     let wrapper;
//     let form;
//     beforeAll(() => {
//       wrapper = setup();
//     });
//   });
// });

// describe('mapDispatchToProps', () => {
//   let dispatch;
//   let result;
//   beforeAll(() => {
//     dispatch = jest.fn(() => Promise.resolve());
//     result = mapDispatchToProps(dispatch);
//   });

//   it('sets submitFeedback on the props', () => {
//     expect(result.submitFeedback).toBeInstanceOf(Function);
//   });

//   it('sets resetFeedback on the props', () => {
//     expect(result.resetFeedback).toBeInstanceOf(Function);
//   });
// });

// describe('mapStateToProps', () => {
//   let result;
//   beforeAll(() => {
//     result = mapStateToProps(globalState);
//   });

//   it('sets sendState on the props', () => {
//     expect(result.sendState).toEqual(globalState.feedback.sendState);
//   });
// });
