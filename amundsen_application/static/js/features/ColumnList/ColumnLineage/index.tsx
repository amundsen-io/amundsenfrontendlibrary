// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import { connect } from 'react-redux';

import { GlobalState } from 'ducks/rootReducer';
import * as React from 'react';
import { emptyLineage } from 'ducks/tableMetadata/reducer';

import { getColumnLineageLink } from 'config/config-utils';
import './styles.scss';
import { Lineage, TableMetadata } from 'interfaces/TableMetadata';

interface ComponentProps {
  columnName: string;
  tableKey: string;
}

interface StateFromProps {
  columnLineage: Lineage;
  tableData: TableMetadata;
}

type Props = ComponentProps & StateFromProps;

const getLink = (table) =>
  `/table_detail/${table.cluster}/${table.database}/${table.schema}/${table.name}` +
  `?source=column_lineage`;

export class ColumnLineageList extends React.Component<Props> {
  renderLineageLinks(entity, index) {
    if (index >= 5) {
      return null;
    }
    return (
      <div>
        <a href={getLink(entity)} target="_blank" rel="noreferrer">
          {entity.schema}.{entity.name}
        </a>
      </div>
    );
  }

  render() {
    const { columnName, columnLineage, tableData } = this.props;
    const { downstream_entities, upstream_entities } = columnLineage;
    if (!downstream_entities.length && !upstream_entities.length) {
      return null;
    }
    const externalLink = getColumnLineageLink(tableData, columnName);
    return (
      <section className="column-lineage-wrapper">
        <div className="column-lineage-list">
          <div className="header-row">
            <span className="title-3">Top 5 Upstream Columns&nbsp;</span>
            <a href={externalLink} rel="noreferrer" target="_blank">
              See More
            </a>
          </div>
          {upstream_entities.map(this.renderLineageLinks)}
        </div>
        <div className="column-lineage-list">
          <div className="header-row">
            <span className="title-3">Top 5 Downstream Columns&nbsp;</span>
            <a href={externalLink} rel="noreferrer" target="_blank">
              See More
            </a>
          </div>
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
  const { columnLineageMap, tableData } = state.tableMetadata;
  const columnLineage = columnLineageMap[ownProps.columnName] || emptyLineage;
  return {
    columnLineage,
    tableData,
  };
};

export default connect<StateFromProps, {}, ComponentProps>(mapStateToProps)(
  ColumnLineageList
);
