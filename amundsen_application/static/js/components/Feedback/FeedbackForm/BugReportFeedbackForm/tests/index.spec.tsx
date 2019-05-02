import * as React from 'react';

import { shallow } from 'enzyme';

import AbstractFeedbackForm from 'components/Feedback/FeedbackForm';
import { SendingState } from 'components/Feedback/types';
import { BugReportFeedbackForm, mapDispatchToProps, mapStateToProps } from '../';
import {

} from 'components/Feedback/constants';

import globalState from 'fixtures/globalState';

describe('BugReportFeedbackForm', () => {
  const setup = () => {
    return shallow(<BugReportFeedbackForm/>)
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
        value: 'Bug Report'
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

    describe('renders bug-summary input as third child', () => {
      it('renders correct label', () => {
        expect(form.children().at(2).find('label').text()).toEqual('Bug Summary');
      });

      it('renders textarea with correct props', () => {
        expect(form.children().at(2).find('textarea').props()).toMatchObject({
          name: 'bug-summary',
          className: 'form-control',
          required: true,
          rows: 3,
          maxLength: 2000,
          placeholder: 'What went wrong?',
        });
      });
    });

    describe('renders repro-steps input as fourth child', () => {
      it('renders correct label', () => {
        expect(form.children().at(3).find('label').text()).toEqual('Reproduction Steps');
      });

      it('renders textarea with correct props', () => {
        expect(form.children().at(3).find('textarea').props()).toMatchObject({
          name: 'repro-steps',
          className: 'form-control',
          required: true,
          rows: 5,
          maxLength: 2000,
          placeholder: 'What did you do to encounter this bug?',
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
