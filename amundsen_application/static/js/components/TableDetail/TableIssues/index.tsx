import * as React from 'react';
import { GlobalState } from 'ducks/rootReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Issue } from 'interfaces'; 
import { getIssues } from 'ducks/issue/reducer'; 
import { logClick } from 'ducks/utilMethods';
import { GetIssuesRequest } from 'ducks/issue/types';
import { truncateText } from '../../../utils/tableissues-utils'; 
import './styles.scss';


export interface StateFromProps {
  issues: Issue[]; 
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
    this.props.getIssues(this.props.tableKey);
  }


  renderIssue = (issue: Issue, index: number) => {
    return (
      <div className="issue-banner" key={`issue-${index}`}>
      <a id={`table-issue-link-${index}`} className="table-issue-link" target="_blank" href={issue.url} onClick={e => logClick(e)}>
        <img className="icon icon-data-quality-warning"/>
        { issue.issue_key }
      </a>
      { truncateText(issue.title) }
      </div>
    ); 
  }

  render() {
    if (this.props.issues.length === 0) {
      return null;
    }

    return (
      <div className="table-issues">
        { this.props.issues.map(this.renderIssue)}
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    issues: state.issue.issues
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getIssues }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(TableIssues);
