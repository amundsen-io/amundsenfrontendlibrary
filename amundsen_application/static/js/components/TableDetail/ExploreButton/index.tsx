import * as React from 'react';
import { connect } from 'react-redux';

import AppConfig from 'config/config';
import { logClick } from 'ducks/utilMethods';
import { GlobalState } from 'ducks/rootReducer';
import { TableMetadata } from 'interfaces';

export interface StateFromProps {
  tableData: TableMetadata;
}

export type ExploreButtonProps = StateFromProps;

export class ExploreButton extends React.Component<ExploreButtonProps> {
  constructor(props) {
    super(props);
  }

  generateUrl() {
    const tableData = this.props.tableData;
    const partition = tableData.partition;

    if (partition.is_partitioned) {
      return AppConfig.tableProfile.exploreUrlGenerator(
        tableData.database, tableData.cluster, tableData.schema, tableData.table_name, partition.key, partition.value);
    } else {
      return AppConfig.tableProfile.exploreUrlGenerator(
        tableData.database, tableData.cluster, tableData.schema, tableData.table_name);
    }
  }

  render() {
    if (!AppConfig.tableProfile.isExploreEnabled) {
      return null;
    }

    return (
      <a
        className="btn btn-default btn-lg"
        href={ this.generateUrl() }
        role="button"
        target="_blank"
        id="explore-sql"
        onClick={ logClick }
      >
        Explore with SQL
      </a>
    );
  }
};

export const mapStateToProps = (state: GlobalState) => {
  return {
    tableData: state.tableMetadata.tableData,
  };
};

export default connect<StateFromProps>(mapStateToProps, null)(ExploreButton);
