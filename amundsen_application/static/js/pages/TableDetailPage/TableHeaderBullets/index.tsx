/*
  This file is copy-pasted from the upstream file at the same path and of the
  same name. It has been modified to include a Lyft specific UI decision.

  This choice requires manually maintaining these files, and they are not unit tested.

  Before defaulting to this pattern for other components, first consider if an
  application configuration would be appropriate and useful for other community
  use cases.
*/

import * as React from 'react';
import { Link } from 'react-router-dom';

import { getDisplayNameByResource, getSourceDisplayName } from 'config/config-utils';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateSearchState } from 'ducks/search/reducer';
import { UpdateSearchStateRequest } from 'ducks/search/types';
import { logClick } from 'ducks/utilMethods';

import { ResourceType } from 'interfaces/Resources';

import { TABLE_VIEW_TEXT } from './constants';

export type TableHeaderBulletsProps = HeaderBulletsProps & DispatchFromProps;

export interface HeaderBulletsProps {
  cluster: string;
  database: string;
  isView: boolean;
}
export interface DispatchFromProps {
  searchDatabase: (databaseText: string) => UpdateSearchStateRequest;
}

export class TableHeaderBullets extends React.Component<TableHeaderBulletsProps> {

  handleClick = (e) => {
    const databaseText = this.props.database;
    logClick(e, {
      target_type: 'database',
      label: databaseText,
    });
    this.props.searchDatabase(databaseText);
  };
  render() {
    return (
      <ul className="header-bullets" >
        <li>{getDisplayNameByResource(ResourceType.table)} </li>
        <li><Link to='/search' onClick={this.handleClick}>{getSourceDisplayName(this.props.database || '', ResourceType.table)}</Link></li>
        <li>{this.props.cluster || ''}</li>
        {this.props.isView && <li>{TABLE_VIEW_TEXT}</li>}
      </ul >
    );
  }

};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      searchDatabase: (databaseText: string) =>
        updateSearchState({
          filters: {
            [ResourceType.table]: { database: databaseText },
          },
          submitSearch: true,
        }),
    },
    dispatch
  );
};

export default connect<null, DispatchFromProps, HeaderBulletsProps>(
  null,
  mapDispatchToProps
)(TableHeaderBullets);
