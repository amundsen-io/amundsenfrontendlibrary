import * as React from 'react';
import { GlobalState } from 'ducks/rootReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Issue } from 'interfaces'; 
import { getIssues } from 'ducks/issue/reducer'; 
import { logClick } from 'ducks/utilMethods';
import { GetIssuesRequest } from 'ducks/issue/types';
import './styles.scss';
import { issueTrackingEnabled } from 'config/config-utils';
import { ReportTableIssue } from '../ReportTableIssue';
import BadgeList from 'components/common/BadgeList';


export interface StateFromProps {
  issues: Issue[]; 
  remainingIssues: number; 
  remainingIssuesUrl: string; 
}

export interface DispatchFromProps {
  getIssues: (key: string) => GetIssuesRequest; 
}

export interface ComponentProps {
  tableKey: string;
}

export type TableIssueProps = StateFromProps & DispatchFromProps & ComponentProps; 

export class TableIssues extends React.Component<TableIssueProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (issueTrackingEnabled()) {
      this.props.getIssues(this.props.tableKey);
    }
  }

  renderIssue = (issue: Issue, index: number) => {
    return (
      <div className="issue-banner" key={`issue-${index}`}>
        <span className={`table-issue-priority ${issue.priority_name}`}>{issue.priority_display_name}</span>
        <a id={`table-issue-link-${index}`} className="table-issue-link" target="_blank" href={issue.url} onClick={logClick}>
<<<<<<< HEAD
          { issue.issue_key }
=======
          <img className="icon icon-red-triangle-warning "/>
          <span>
            { issue.issue_key }
          </span>
>>>>>>> master
        </a>
        <span className="issue-title-display-text truncated">
          <span className="issue-title-name">
           "{ issue.title }
          </span>"
        </span> 
      </div>
    ); 
  }

  renderMoreIssuesMessage = (count: number, url: string) => {
    if (count === 0) {
      return ''; 
     }

    return (
      <div className="issue-banner" key="more-issue-link">
        <a id="more-issues-link" className="table-issue-more-issues" target="_blank" href={url} onClick={logClick}>
         `View all {count} issues`
        </a> 
    </div>
    );
  }

  
  render() {
    <h2>Issues</h2>
    if (!issueTrackingEnabled()) {
      return ''; 
    }
    
    if (this.props.issues.length === 0) {
      return (
        <div>No associated issues</div>
      );
    }

    return (
      <div className="table-issues">
        { this.props.issues.map(this.renderIssue)}
        { this.renderMoreIssuesMessage(this.props.remainingIssues, this.props.remainingIssuesUrl)}
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    issues: state.issue.issues, 
    remainingIssues: state.issue.remainingIssues, 
    remainingIssuesUrl: state.issue.remainingIssuesUrl
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getIssues }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(TableIssues);
