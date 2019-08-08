import * as React from 'react';
import { connect } from 'react-redux';

import { TABLE_RESOURCE_TITLE, USER_RESOURCE_TITLE } from 'components/SearchPage/constants';
import AppConfig from 'config/config';
import { GlobalState } from 'ducks/rootReducer';
import { DashboardSearchResults, TableSearchResults, UserSearchResults } from 'ducks/search/types';
import { ResourceType } from 'interfaces/Resources';


export interface StateFromProps {
  selectedTab: ResourceType,
  tables: TableSearchResults;
  dashboards: DashboardSearchResults;
  users: UserSearchResults;
}

export interface OwnProps {
  onChange: (resource: ResourceType) => void;
}

export type ResourceSelectorProps = StateFromProps & OwnProps;

interface ResourceOptionConfig {
  type: ResourceType;
  label: string;
  count: number;
}

export class ResourceSelector extends React.Component<ResourceSelectorProps > {
  constructor(props) {
    super(props);
  }

  onChange = (event) => {
    this.props.onChange(event.target.value);
  };

  renderRadioOption = (option: ResourceOptionConfig) => {
    return (
      <div className="radio">
        <label className="radio-label">
          <input
            type="radio"
            name="resource"
            value={ option.type }
            checked={ this.props.selectedTab === option.type }
            onChange={ this.onChange }
          />
          <span className="subtitle-2">{ option.label }</span>
          <span className="body-secondary-3 pull-right">{ option.count }</span>
        </label>
      </div>
    );
  };

  render = () => {
    const resourceOptions = [{
      type: ResourceType.table,
      label: TABLE_RESOURCE_TITLE,
      count: this.props.tables.total_results,
    }];

    if (AppConfig.indexUsers.enabled) {
      resourceOptions.push({
        type: ResourceType.user,
        label: USER_RESOURCE_TITLE,
        count: this.props.users.total_results,
      });
    }

    return (
      <>
        <div className="title-2">Resource</div>
        {
          resourceOptions.map((option) => this.renderRadioOption(option))
        }
      </>
    );
  }
}

export const mapStateToProps = (state: GlobalState, ownProps: OwnProps) => {
  return {
    selectedTab: state.search.selectedTab,
    tables: state.search.tables,
    users: state.search.users,
    dashboards: state.search.dashboards,
    onChange: ownProps.onChange
  };
};


// TODO - use 'mapDispatchToProps' to map the resource-change action instead of using the onChange prop.

export default connect<StateFromProps, null, OwnProps>(mapStateToProps)(ResourceSelector);
