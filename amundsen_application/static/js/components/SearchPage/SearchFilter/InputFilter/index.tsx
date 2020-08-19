// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  updateFilterByCategory,
  UpdateFilterRequest,
} from 'ducks/search/filters/reducer';

import { GlobalState } from 'ducks/rootReducer';
import { APPLY_BTN_TEXT } from '../constants';

interface OwnProps {
  categoryId: string;
}

interface StateFromProps {
  value: string;
}

interface DispatchFromProps {
  updateFilter: (
    categoryId: string,
    value: string | undefined
  ) => UpdateFilterRequest;
}

export type InputFilterProps = StateFromProps & DispatchFromProps & OwnProps;

export interface InputFilterState {
  value: string;
}

export class InputFilter extends React.Component<
  InputFilterProps,
  InputFilterState
> {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  componentDidUpdate = (prevProps: StateFromProps) => {
    const newValue = this.props.value;
    if (prevProps.value !== newValue) {
      this.setState({ value: newValue || '' });
    }
  };

  onApplyChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.state.value) {
      this.props.updateFilter(this.props.categoryId, this.state.value);
    } else {
      this.props.updateFilter(this.props.categoryId, undefined);
    }
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value.toLowerCase() });
  };

  render = () => {
    const { categoryId } = this.props;
    return (
      <form
        className="input-section-content form-group"
        onSubmit={this.onApplyChanges}
      >
        <div className="nhsuk-form-group">
          <input
            type="text"
            className="nhsuk-input"
            name={categoryId}
            id={categoryId}
            onChange={this.onInputChange}
            value={this.state.value}
          />
        </div>
        <div>
          <button
            name={categoryId}
            className="nhsuk-button nhsuk-button--secondary"
            type="submit"
          >
            {APPLY_BTN_TEXT}
          </button>
        </div>
      </form>
    );
  };
}

export const mapStateToProps = (state: GlobalState, ownProps: OwnProps) => {
  const filterState = state.search.filters;
  const value = filterState[state.search.resource]
    ? filterState[state.search.resource][ownProps.categoryId]
    : '';
  return {
    value: value || '',
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      updateFilter: (categoryId: string, value: string | undefined) =>
        updateFilterByCategory({ categoryId, value }),
    },
    dispatch
  );
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(InputFilter);
