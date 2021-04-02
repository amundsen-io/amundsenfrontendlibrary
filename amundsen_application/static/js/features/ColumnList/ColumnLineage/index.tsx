// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import { connect } from 'react-redux';

import { GlobalState } from 'ducks/rootReducer';
import * as React from 'react';
import { GetColumnLineageRequest } from 'ducks/tableMetadata/types';
import { emptyLineage } from 'ducks/tableMetadata/reducer';

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
  getLink = (table) =>
    `/table_detail/${table.cluster}/${table.database}/${table.schema}/${table.name}` +
    `?source=column_lineage`;

  renderLineageLinks(entity, index) {
    if (index >= 5) {
      return null;
    }
    return (
      <div>
        <a href={this.getLink(entity)} target="_blank" rel="noreferrer">
          {entity.schema}.{entity.name}
        </a>
      </div>
    );
  }

  render() {
    const { downstream_entities, upstream_entities } = this.props.columnLineage;
    if (!downstream_entities.length && !upstream_entities.length) {
      return null;
    }
    return (
      <section className="column-lineage row">
        <div className="lineage-column col-xs-6">
          <div className="title-3">Top 5 Upstream Columns</div>
          {upstream_entities.map(this.renderLineageLinks)}
        </div>
        <div className="lineage-column col-xs-6">
          <div className="title-3">Top 5 Downstream Columns</div>
          {downstream_entities.map(this.renderLineageLinks)}
        </div>
      </section>
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

export default connect<StateFromProps, {}, ComponentProps>(mapStateToProps)(
  ColumnLineageList
);
