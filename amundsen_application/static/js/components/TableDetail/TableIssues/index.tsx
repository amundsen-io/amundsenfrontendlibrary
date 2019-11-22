import * as React from 'react';
import axios, { AxiosResponse } from 'axios';


// import './styles.scss';

export interface TableIssueProps {
  tableKey: string;
}

interface TableIssueState {
  issues: JiraIssue[];
}

interface JiraIssue {

}

export default class TableIssues extends React.Component<TableIssueProps, TableIssueState> {

  constructor(props) {
    super(props);

    this.state = {
      issues: []
    };
    this.fetchIssues();
  }

  fetchIssues = () => {
    axios.get(`/api/jira/v0/getTableIssues?key=${this.props.tableKey}`)
      .then((response: AxiosResponse<JiraIssue[]>) => {
        console.log(response);
        // this.setState({ issues: response.data });
      });
  };


  renderIssue = (issue: JiraIssue, index: number) => {
    return (
      <div id={`jira-issue-${index}`}>
        JIRA ISSUE
        { issue }
      </div>
    )
  };

  render() {
    return (
        <>
          { this.state.issues.map(this.renderIssue)}
        </>
    );
  }
}
