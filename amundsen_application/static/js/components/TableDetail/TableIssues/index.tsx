import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { JiraIssue } from 'interfaces'; 

import './styles.scss';
import { GetJiraIssuesResponse } from 'ducks/jira/types';

export interface TableIssueProps {
  tableKey: string;
}

interface TableIssueState {
  issues: JiraIssue[];
}


export default class TableIssues extends React.Component<TableIssueProps, TableIssueState> {

  constructor(props) {
    super(props);

    this.state = {
      issues: []
    };
  }

  componentDidMount() {
    this.fetchIssues();
  }

  fetchIssues = () => {
    axios.get(`/api/jira/v0/issues?key=${this.props.tableKey}`)
      .then((response: AxiosResponse<GetJiraIssuesResponse>) => {
        // console.log(response);
        this.setState({ issues: response.data.payload.jiraIssues });
      });
  };


  renderIssue = (issue: JiraIssue, index: number) => {
    return (
      <div className="issue-banner truncated" key={`jira-issue-${index}`}>
        <a target="_blank" href={issue.url}>
          { issue.issue_key }
        </a>
        &nbsp;&mdash; { issue.title }
      </div>
    )
  };

  render() {

    if (this.state.issues.length === 0) {
      return null;
    }

    return (
        <div className="table-issues">
          { this.state.issues.map(this.renderIssue)}
        </div>
    );
  }
}
