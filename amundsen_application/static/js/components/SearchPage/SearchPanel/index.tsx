import * as React from 'react';
import { connect } from 'react-redux';
import { ResourceType } from 'interfaces/Resources';
import { GlobalState } from 'ducks/rootReducer';
import { DashboardSearchResults, TableSearchResults, UserSearchResults } from 'ducks/search/types';
import { TABLE_RESOURCE_TITLE, USER_RESOURCE_TITLE } from 'components/SearchPage/constants';
import AppConfig from 'config/config';

import './styles.scss';

export interface StateFromProps {
  selectedTab: ResourceType,
  tables: TableSearchResults;
  dashboards: DashboardSearchResults;
  users: UserSearchResults;
}

export interface OwnProps {
  onTabChange: (tab: ResourceType) => void;
}

export type SearchPanelProps = StateFromProps & OwnProps;

export class SearchPanel extends React.Component<SearchPanelProps> {

  constructor(props) {
    super(props);
  }

  onChange = (event) => {
    this.props.onTabChange(event.target.value);
  };

  renderRadioOption = (value: ResourceType, label: string, count: number) => {
    return (
      <div className="radio">
        <label className="radio-label">
          <input
            type="radio"
            name="resource"
            value={ value }
            checked={ this.props.selectedTab === value }
            onChange={ this.onChange }
          />
          <span className="subtitle-2">{ label }</span>
          <span className="body-secondary-3 pull-right">{ count }</span>
        </label>
      </div>
    );
  };


  render = () => {
    return (
      <div className="search-control-panel">
        <div className="title-2">Resource</div>
        {
          this.renderRadioOption(ResourceType.table, TABLE_RESOURCE_TITLE, this.props.tables.total_results)
        }
        {
          AppConfig.indexUsers.enabled &&
          this.renderRadioOption(ResourceType.user, USER_RESOURCE_TITLE, this.props.users.total_results)
        }
      </div>
    );
  }
};

export const mapStateToProps = (state: GlobalState, ownProps: OwnProps) => {
  return {
    selectedTab: state.search.selectedTab,
    tables: state.search.tables,
    users: state.search.users,
    dashboards: state.search.dashboards,
    onTabChange: ownProps.onTabChange
  };
};


// TODO - use 'mapDispatchToProps' to map the tab-change action instead of using the onTabChange prop.

export default connect<StateFromProps, null, OwnProps>(mapStateToProps)(SearchPanel);
