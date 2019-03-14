import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from "../../ducks/rootReducer";
import { searchAll, searchResource } from '../../ducks/search/reducer';
import { getPopularTables } from '../../ducks/popularTables/reducer';

import SearchPage, { DispatchFromProps, StateFromProps } from '../../components/SearchPage';

export const mapStateToProps = (state: GlobalState) => {
  return {
    searchTerm: state.search.search_term,
    popularTables: state.popularTables,
    tables: state.search.tables,
    users: state.search.users,
    dashboards: state.search.dashboards,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ searchAll, searchResource, getPopularTables } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(SearchPage);
