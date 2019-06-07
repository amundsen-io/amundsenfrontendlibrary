import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import {
  POPULAR_TABLES_LABEL,
  POPULAR_TABLES_INFO_TEXT,
  POPULAR_TABLES_SOURCE_NAME,
  POPULAR_TABLES_PER_PAGE
} from './constants';
import InfoButton from 'components/common/InfoButton';

import { getPopularTables } from 'ducks/popularTables/reducer';
import { GetPopularTablesRequest, TableResource } from 'ducks/popularTables/types';
import { GlobalState } from 'ducks/rootReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ResourceList from "components/common/ResourceList";

export interface StateFromProps {
  popularTables: TableResource[];
}

export interface DispatchFromProps {
  getPopularTables: () => GetPopularTablesRequest;
}

export type PopularTablesProps = StateFromProps & DispatchFromProps;

interface PopularTablesState {
  activePage: number;
}

export class PopularTables extends React.Component<PopularTablesProps, PopularTablesState> {
  constructor(props) {
    super(props);

    this.state = { activePage: 0 };
  }

  componentDidMount() {
    this.props.getPopularTables();
  }

  onPaginationChange = (pageNumber: number) => {
    this.setState({ activePage: pageNumber - 1 });
  };

  render() {
    return (
      <>
        <div className="popular-tables-header">
          <label className="title-1">{POPULAR_TABLES_LABEL}</label>
          <InfoButton infoText={POPULAR_TABLES_INFO_TEXT} />
        </div>
        <ResourceList
          activePage={ this.state.activePage }
          isFullList={ true }
          items={ this.props.popularTables }
          itemsPerPage={ POPULAR_TABLES_PER_PAGE }
          onPagination={ this.onPaginationChange }
          source={ POPULAR_TABLES_SOURCE_NAME }
        />
      </>
    );
  }
}
export const mapStateToProps = (state: GlobalState) => {
  return {
    popularTables: state.popularTables,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getPopularTables }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(PopularTables);
