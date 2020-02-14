import * as React from 'react';
import { GlobalState } from 'ducks/rootReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { JiraIssue } from 'interfaces'; 
import { getJiraIssues } from 'ducks/jira/reducer'; 
import { GetJiraIssuesRequest } from 'ducks/jira/types';
import './styles.scss';


export interface StateFromProps {
  jiraIssues: JiraIssue[]; 
}

export interface DispatchFromProps {
  getJiraIssues: (key: string) => GetJiraIssuesRequest; 
}

export interface ComponentProps {
  tableKey: string;
}

export type TableIssueProps = StateFromProps & DispatchFromProps & ComponentProps; 

export class TableIssues extends React.Component<TableIssueProps> {
  static ASSOCIATION_TEXT = " is associated with this table";
  static MAX_TEXT_LENGTH = 35; 

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getJiraIssues(this.props.tableKey);
  }

  truncateText(issueTitle: string) : string {
      let truncated = issueTitle.length > TableIssues.MAX_TEXT_LENGTH ? 
        issueTitle.substring(0, TableIssues.MAX_TEXT_LENGTH) : issueTitle;  
      return '"' + truncated + '"' +  TableIssues.ASSOCIATION_TEXT; 
  }

  renderIssue = (issue: JiraIssue, index: number) => {
    return (
      <div className="issue-banner" key={`jira-issue-${index}`}>
        <a className="issue-link" target="_blank" href={issue.url}>
          <img className="icon icon-data-quality-warning"></img>
          { issue.issue_key }
        </a>
        { this.truncateText(issue.title) }
      </div>
    )
  };

  render() {
    if (this.props.jiraIssues.length === 0) {
      return null;
    }

    return (
        <div className="table-issues">
          { this.props.jiraIssues.map(this.renderIssue)}
        </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState, componentProps: ComponentProps) => {
  return {
    jiraIssues: state.jira.jiraIssues,
    tableKey: componentProps.tableKey
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getJiraIssues }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(TableIssues);
