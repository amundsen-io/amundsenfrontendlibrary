// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from 'ducks/rootReducer';
// import { isColumnListLineageEnabled } from 'config/config-utils';
import * as React from 'react';
import { GetColumnLineageRequest } from 'ducks/tableMetadata/types';
import { getColumnLineage } from 'ducks/tableMetadata/reducer';

interface ComponentProps {
  columnName: string;
  tableKey: string;
}

interface DispatchFromProps {
  getColumnLineage: (
    key: string,
    columnName: string
  ) => GetColumnLineageRequest;
}

interface StateFromProps {
  columnLineage: any;
}

type Props = ComponentProps & DispatchFromProps & StateFromProps;

export class ColumnLineageList extends React.Component<Props> {
  componentDidMount() {
    // TODO - Delay calling this until the user expands this particular column
    const { getColumnLineage, tableKey, columnName } = this.props;
    getColumnLineage(tableKey, columnName);
  }

  render() {
    return 'hello';
  }
}

export const mapStateToProps = (
  state: GlobalState,
  ownProps: ComponentProps
) => {
  const { columnLineageMap } = state.tableMetadata;
  const columnLineage = columnLineageMap[ownProps.columnName];
  return {
    columnLineage,
  };
};

export const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ getColumnLineage }, dispatch);

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(
  mapStateToProps,
  mapDispatchToProps
)(ColumnLineageList);
