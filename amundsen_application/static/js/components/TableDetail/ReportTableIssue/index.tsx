import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GlobalState } from 'ducks/rootReducer';

import LoadingSpinner from 'components/common/LoadingSpinner';
import { createIssue } from 'ducks/issue/reducer'; 
import { CreateIssueRequest } from 'ducks/issue/types';
import './styles.scss';
import { logClick } from 'ducks/utilMethods';

export interface ComponentProps {
  tableKey: string;
  tableName: string;
}

export interface DispatchFromProps {
  createIssue: (data: FormData) => CreateIssueRequest; 
}

export interface StateFromProps {
  isLoading: boolean;
}

interface ReportTableIssueState {
  isOpen: boolean; 
}

export type ReportTableIssueProps = StateFromProps & DispatchFromProps & ComponentProps

export class ReportTableIssue extends React.Component<ReportTableIssueProps, ReportTableIssueState> {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  submitForm = (event) => {
    logClick(event);
    event.preventDefault();
    const form = document.getElementById("report-table-issue-form") as HTMLFormElement;
    const formData = new FormData(form);
    this.props.createIssue(formData);
    this.setState({isOpen: false}); 
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    if (this.props.isLoading) {
      return <LoadingSpinner />;
    }

    return (
        <>
          <a href="javascript:void(0)"
             className="report-table-issue-link"
             onClick={this.toggle}
          >
            Report Data Issue
          </a>
          {
            this.state.isOpen &&
            <div className="report-table-issue-modal">
              <h3 className="">
                Report Data Issue
              </h3>
              <button type="button" className="btn btn-close" aria-label={"close"} onClick={this.toggle} />
              <form id="report-table-issue-form" onSubmit={ this.submitForm }>
                <input type="hidden" name="key" value={ this.props.tableKey }/>

                <div className="form-group">
                  <label>Title</label>
                  <input name="title" className="form-control" required={true} maxLength={200} defaultValue={`Data Issue On: ${this.props.tableName}`}/>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" className="form-control" rows={5} required={true} maxLength={2000}/>
                </div>
                <div className="controls">
                  <button className="btn btn-default cancel" type="button" onClick={this.toggle}>Cancel</button>
                  <button className="btn btn-primary submit" type="submit" >Submit</button>
                </div>
              </form>
            </div>
          }
      </>
    );
  }
}
export const mapStateToProps = (state: GlobalState) => {
  return {
    isLoading: state.issue.isLoading
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ createIssue } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(ReportTableIssue);
