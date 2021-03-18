// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from 'ducks/rootReducer';
// import { isColumnListLineageEnabled } from 'config/config-utils';
import * as React from 'react';
import { GetColumnLineageRequest } from 'ducks/tableMetadata/types';
import { emptyLineage, getColumnLineage } from 'ducks/tableMetadata/reducer';

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
    const { downstream_entities, upstream_entities } = this.props.columnLineage;
    if (!downstream_entities.length && !upstream_entities.length) {
      return null;
    }
    return (
      // TODO - make pretty
      <div>
        <div>
          <h2>upstream</h2>
          {upstream_entities.map((item) => (
            <div>{item.key}</div>
          ))}
        </div>
        <div>
          <h2>downstream</h2>
          {downstream_entities.map((item) => (
            <div>{item.key}</div>
          ))}
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (
  state: GlobalState,
  ownProps: ComponentProps
) => {
  const { columnLineageMap } = state.tableMetadata;
  const columnLineage = columnLineageMap[ownProps.columnName] || emptyLineage;
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
