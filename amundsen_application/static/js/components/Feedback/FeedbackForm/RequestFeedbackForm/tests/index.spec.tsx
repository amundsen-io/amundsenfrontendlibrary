import * as React from 'react';

import { shallow } from 'enzyme';

import AbstractFeedbackForm from 'components/Feedback/FeedbackForm';
import { SendingState } from 'components/Feedback/types';
import { RequestFeedbackForm, mapDispatchToProps, mapStateToProps } from '../';
import {

} from 'components/Feedback/constants';

import globalState from 'fixtures/globalState';

describe('RequestFeedbackForm', () => {
  const setup = () => {
    return shallow(<RequestFeedbackForm/>)
  };

  it('is instance of AbstractFeedbackForm', () => {
    expect(setup().instance()).toBeInstanceOf(AbstractFeedbackForm);
  });

  describe('renderCustom', () => {
    let wrapper;
    let form;
    beforeAll(() => {
      wrapper = setup();
      form = wrapper.find('form');
    });

    it('renders form with correct props', () => {
      expect(form.props()).toMatchObject({
        id: AbstractFeedbackForm.FORM_ID,
        onSubmit: wrapper.instance().submitForm,
      });
    });

    it('renders feedback-type input as first child with correct props', () => {
      expect(form.children().at(0).find('input').props()).toMatchObject({
        type: 'hidden',
        name: 'feedback-type',
        value: 'Feature Request'
      });
    });

    describe('renders subject input as second child', () => {
      it('renders correct label', () => {
        expect(form.children().at(1).find('label').text()).toEqual('Subject');
      });

      it('renders input with correct props', () => {
        expect(form.children().at(1).find('input').props()).toMatchObject({
          type: 'text',
          name: 'subject',
          className: 'form-control',
          required: true,
          placeholder: 'Enter a subject',
        });
      });
    });

    describe('renders feature-summary input as third child', () => {
      it('renders correct label', () => {
        expect(form.children().at(2).find('label').text()).toEqual('Feature Summary');
      });

      it('renders textarea with correct props', () => {
        expect(form.children().at(2).find('textarea').props()).toMatchObject({
          name: 'feature-summary',
          className: 'form-control',
          required: true,
          rows: 3,
          maxLength: 2000,
          placeholder: 'What feature are you requesting?',
        });
      });
    });

    describe('renders value-prop input as fourth child', () => {
      it('renders correct label', () => {
        expect(form.children().at(3).find('label').text()).toEqual('Value Proposition');
      });

      it('renders textarea with correct props', () => {
        expect(form.children().at(3).find('textarea').props()).toMatchObject({
          name: 'value-prop',
          className: 'form-control',
          required: true,
          rows: 5,
          maxLength: 2000,
          placeholder: 'How does this feature add value?',
        });
      });
    });

    it('renders submit button with correct props', () => {
      expect(form.find('button').props()).toMatchObject({
        className: 'btn btn-default submit',
        type: 'submit',
      });
    });
  });
});

describe('mapDispatchToProps', () => {
  let dispatch;
  let result;
  beforeAll(() => {
    dispatch = jest.fn(() => Promise.resolve());
    result = mapDispatchToProps(dispatch);
  });

  it('sets submitFeedback on the props', () => {
    expect(result.submitFeedback).toBeInstanceOf(Function);
  });

  it('sets resetFeedback on the props', () => {
    expect(result.resetFeedback).toBeInstanceOf(Function);
  });
});

describe('mapStateToProps', () => {
  let result;
  beforeAll(() => {
    result = mapStateToProps(globalState);
  });

  it('sets sendState on the props', () => {
    expect(result.sendState).toEqual(globalState.feedback.sendState);
  });
});
