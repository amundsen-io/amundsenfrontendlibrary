import * as React from 'react';
import axios from 'axios';

import './styles.scss';

export interface ReportTableIssueProps {
  tableKey: string;
  title: string;
}

interface ReportTableIssueState {
  isOpen: boolean;
}

export default class ReportTableIssue extends React.Component<ReportTableIssueProps, ReportTableIssueState> {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  submitForm = (event) => {
    event.preventDefault();
    const form = document.getElementById("report-table-issue-form") as HTMLFormElement;
    const formData = new FormData(form);
    console.log(formData);

    return axios({
      data: formData,
      url: '/api/jira/issue',
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data' }
    });

  };


  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
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
                  <input name="title" className="form-control" required={true} maxLength={200} defaultValue={this.props.title}/>
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
