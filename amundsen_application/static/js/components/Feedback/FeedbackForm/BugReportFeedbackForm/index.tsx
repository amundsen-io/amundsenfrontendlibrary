import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AbstractFeedbackForm, { DispatchFromProps, StateFromProps } from '../../FeedbackForm';

import { GlobalState } from 'ducks/rootReducer';
import { submitFeedback, resetFeedback } from 'ducks/feedback/reducer';

export class BugReportFeedbackForm extends AbstractFeedbackForm {
  renderCustom() {
    return (
      <form id={AbstractFeedbackForm.FORM_ID} onSubmit={ this.submitForm }>
        <input type="hidden" name="feedback-type" value="Bug Report"/>
        <div className="form-group">
          <label>Subject</label>
          <input type="text" name="subject" className="form-control" required={ true } placeholder="Enter a subject" />
        </div>
        <div className="form-group">
          <label>Bug Summary</label>
          <textarea name="bug-summary" className="form-control" required={ true }
                    rows={3} maxLength={ 2000 } placeholder="What went wrong?"/>
        </div>
        <div className="form-group">
          <label>Reproduction Steps</label>
          <textarea name="repro-steps" className="form-control" rows={5} required={ true }
                    maxLength={ 2000 } placeholder="What did you do to encounter this bug?"/>
        </div>
        <button className="btn btn-default submit" type="submit">Submit</button>
      </form>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    sendState: state.feedback.sendState,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ submitFeedback, resetFeedback } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(BugReportFeedbackForm);
