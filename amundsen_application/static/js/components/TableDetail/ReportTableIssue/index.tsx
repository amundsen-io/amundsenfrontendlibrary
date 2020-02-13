import * as React from 'react';
import axios from 'axios';

import './styles.scss';
import LoadingSpinner from 'components/common/LoadingSpinner';

export interface ReportTableIssueProps {
  tableKey: string;
  tableName: string;
}

interface ReportTableIssueState {
  isOpen: boolean;
  isLoading: boolean;
}

export default class ReportTableIssue extends React.Component<ReportTableIssueProps, ReportTableIssueState> {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isLoading: false,
    };
  }

  submitForm = (event) => {
    event.preventDefault();
    const form = document.getElementById("report-table-issue-form") as HTMLFormElement;
    const formData = new FormData(form);
    axios({
      data: formData,
      url: '/api/jira/v0/issue',
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data' }
    }).then(() => {
      // this.setState({ isLoading: false });
      document.location.reload();
    });
    this.setState({ isLoading: true });
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    if (this.state.isLoading) {
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
                  <button className="btn btn-primary submit" type="submit">Submit</button>
                </div>
              </form>
            </div>
          }
      </>
    );
  }
}