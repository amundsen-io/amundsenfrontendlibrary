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
import ReportTableIssue from 'components/TableDetail/ReportTableIssue';

export interface StateFromProps {
  issues: Issue[]; 
  total: number; 
  allIssuesUrl: string; 
}

export interface DispatchFromProps {
  getIssues: (key: string) => GetIssuesRequest; 
}

export interface ComponentProps {
  tableKey: string;
  tableName: string; 
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
        <span className={`table-issue-priority ${issue.priority_name}`}>
          {issue.priority_display_name}
        </span>
        <a id={`table-issue-link-${index}`} className="table-issue-link" target="_blank" href={issue.url} onClick={logClick}>
          <span>
            { issue.issue_key }
          </span>
        </a>
        <span className="issue-title-display-text truncated">
          <span className="issue-title-name">
            { issue.title }
          </span>
        </span> 
        <span className="table-issue-status">
            {issue.status}
        </span>
      </div>
    ); 
  }

  renderMoreIssuesMessage = (count: number, url: string) => {
    if (!count || count === 0) {
      return this.renderReportIssueLink(count); 
     }

    return (
      <span className="table-more-issues" key="more-issue-link">
        <a id="more-issues-link" className="table-issue-more-issues" target="_blank" href={url} onClick={logClick}>
         View all {count} issues
        </a> 
        | 
        <div className="table-report-new-issue"> { this.renderReportIssueLink(count) } </div>
      </span>
    );
  }

  renderReportIssueLink = (count: number) => {
    if (count && count === 0) {
      return (
        <ReportTableIssue tableKey={ this.props.tableKey } tableName={ this.props.tableName }/>
      );
    }
    return (
      <ReportTableIssue tableKey={ this.props.tableKey } tableName={ this.props.tableName }></ReportTableIssue>
    ); 
  }
  
  render() {
    if (!issueTrackingEnabled()) {
      return ''; 
    }
    
    if (this.props.issues.length === 0) {
      return (
        <div>
          <div className="section-title title-3">
            Issues
          </div>
          <div className="table-issues">
            <div className="issue-banner">
              No associated issues
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
          <div className="section-title title-3">
            Issues
          </div>
          <div className="table-issues">
            { this.props.issues.map(this.renderIssue)}
          </div>
          { this.renderMoreIssuesMessage(this.props.total, this.props.allIssuesUrl)}
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    issues: state.issue.issues, 
    total: state.issue.total, 
    allIssuesUrl: state.issue.allIssuesUrl
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getIssues }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(TableIssues);
