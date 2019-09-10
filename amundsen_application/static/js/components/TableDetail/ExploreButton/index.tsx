import * as React from 'react';

import { connect } from 'react-redux';

import { TableMetadata } from 'interfaces';
import AppConfig from 'config/config';
import { logClick } from 'ducks/utilMethods';
import { GlobalState } from 'ducks/rootReducer';

export interface StateFromProps {
  tableData: TableMetadata;
}


export type ExploreButtonProps = StateFromProps;

export class ExploreButton extends React.Component<ExploreButtonProps> {
  constructor(props) {
    super(props);
  }

  render() {
    if (!AppConfig.tableProfile.isExploreEnabled) {
      return null;
    }
    const tableData = this.props.tableData;
    const partition = tableData.partition;

    let href;
    if (partition.is_partitioned) {
      href = AppConfig.tableProfile.exploreUrlGenerator(
        tableData.database, tableData.cluster, tableData.schema, tableData.table_name, partition.key, partition.value);
    } else {
      href = AppConfig.tableProfile.exploreUrlGenerator(
        tableData.database, tableData.cluster, tableData.schema, tableData.table_name);
    }

    return (
      <a
        className="btn btn-default btn-lg"
        href={ href }
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
