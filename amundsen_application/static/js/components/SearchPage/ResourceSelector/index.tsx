// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  DASHBOARD_RESOURCE_TITLE,
  TABLE_RESOURCE_TITLE,
  USER_RESOURCE_TITLE,
} from 'components/SearchPage/constants';
import { indexDashboardsEnabled, indexUsersEnabled } from 'config/config-utils';
import { GlobalState } from 'ducks/rootReducer';
import { updateSearchState } from 'ducks/search/reducer';
import {
  DashboardSearchResults,
  TableSearchResults,
  UpdateSearchStateRequest,
  UserSearchResults,
} from 'ducks/search/types';
import { ResourceType } from 'interfaces/Resources';

const RESOURCE_SELECTOR_TITLE = 'Resource';

export interface StateFromProps {
  resource: ResourceType;
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
}

export class ResourceSelector extends React.Component<ResourceSelectorProps> {
  onChange = (event) => {
    this.props.setResource(event.target.value);
  };

  renderRadioOption = (option: ResourceOptionConfig, index: number) => {
    return (
      <div key={`resource-radio-item:${index}`} className="nhsuk-radios__item">
        <input
          id={`radio-item-${index}`}
          className="nhsuk-radios__input"
          type="radio"
          name="resource"
          value={option.type}
          checked={this.props.resource === option.type}
          onChange={this.onChange}
        />
        <label
          className="nhsuk-label nhsuk-radios__label"
          htmlFor={`radio-item-${index}`}
        >
          {option.label} ({option.count})
        </label>
      </div>
    );
  };

  render = () => {
    const resourceOptions = [
      {
        type: ResourceType.table,
        label: TABLE_RESOURCE_TITLE,
        count: this.props.tables.total_results,
      },
    ];

    if (indexDashboardsEnabled()) {
      resourceOptions.push({
        type: ResourceType.dashboard,
        label: DASHBOARD_RESOURCE_TITLE,
        count: this.props.dashboards.total_results,
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
        <div className="nhsuk-form-group">
          <fieldset className="nhsuk-fieldset">
            <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--l">
              <h1 className="nhsuk-fieldset__heading">
                {RESOURCE_SELECTOR_TITLE}
              </h1>
            </legend>
            <div className="nhsuk-radios">
              {resourceOptions.map((option, index) =>
                this.renderRadioOption(option, index)
              )}
            </div>
          </fieldset>
        </div>
      </>
    );
  };
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
  return bindActionCreators(
    {
      setResource: (resource: ResourceType) =>
        updateSearchState({ resource, updateUrl: true }),
    },
    dispatch
  );
};

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ResourceSelector);
