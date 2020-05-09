import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { DASHBOARD_RESOURCE_TITLE, TABLE_RESOURCE_TITLE, USER_RESOURCE_TITLE } from 'components/SearchPage/constants';
import { indexDashboardsEnabled, indexDashboardsIsBeta, indexUsersEnabled } from 'config/config-utils';
import { GlobalState } from 'ducks/rootReducer';
import { updateSearchState } from 'ducks/search/reducer';
import {
  DashboardSearchResults,
  TableSearchResults,
  UpdateSearchStateRequest,
  UserSearchResults
} from 'ducks/search/types';
import { ResourceType } from 'interfaces/Resources';
import Flag from 'components/common/Flag';

export interface StateFromProps {
  resource: ResourceType,
  tables: TableSearchResults;
  dashboards: DashboardSearchResults;
  users: UserSearchResults;
}

export interface DispatchFromProps {
  setResource: (resource: ResourceType) => UpdateSearchStateRequest;
}

export type ResourceSelectorProps = StateFromProps & DispatchFromProps;

interface ResourceOptionConfig {
  type: ResourceType;
  label: string;
  count: number;
  showBetaFlag?: boolean;
}

export class ResourceSelector extends React.Component<ResourceSelectorProps > {
  constructor(props) {
    super(props);
  }

  onChange = (event) => {
    this.props.setResource(event.target.value);
  };

  renderRadioOption = (option: ResourceOptionConfig, index: number) => {
    return (
      <div key={`resource-radio-item:${index}`} className="radio">
        <label className="radio-label">
          <input
            type="radio"
            name="resource"
            value={ option.type }
            checked={ this.props.resource === option.type }
            onChange={ this.onChange }
          />
          <span className="subtitle-2">{ option.label }</span>
          { option.showBetaFlag && <Flag text="beta" labelStyle="default"/> }
          <span className="body-secondary-3 pull-right">{ option.count }</span>
        </label>
      </div>
    );
  };

  render = () => {
    const resourceOptions: ResourceOptionConfig[] = [{
      type: ResourceType.table,
      label: TABLE_RESOURCE_TITLE,
      count: this.props.tables.total_results,
    }];

    if (indexDashboardsEnabled()) {
      resourceOptions.push({
        type: ResourceType.dashboard,
        label: DASHBOARD_RESOURCE_TITLE,
        count: this.props.dashboards.total_results,
        showBetaFlag: indexDashboardsIsBeta(),
      });
    }

    if (indexUsersEnabled()) {
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
          resourceOptions.map((option, index) => this.renderRadioOption(option, index))
        }
      </>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    resource: state.search.resource,
    tables: state.search.tables,
    users: state.search.users,
    dashboards: state.search.dashboards,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    setResource: (resource: ResourceType) => updateSearchState({ resource, updateUrl: true }),
  }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(ResourceSelector);
