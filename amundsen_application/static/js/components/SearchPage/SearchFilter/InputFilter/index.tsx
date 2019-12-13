import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FilterInput } from 'interfaces';

import { updateSingleOption } from 'ducks/search/filters/reducer';

import { APPLY_BTN_TEXT } from '../constants';

interface StateFromProps {
  categoryId: string;
  disabled?: boolean;
  value: string;
}

interface DispatchFromProps {
  onApplyChanges: (input: FilterInput) => void;
}

export type InputFilterProps = StateFromProps & DispatchFromProps;

export interface InputFilterState {
  value: string;
}

export class InputFilter extends React.Component<InputFilterProps, InputFilterState> {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  onApplyChanges = () => {
    this.props.onApplyChanges({ category: this.props.categoryId, value: this.state.value });
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value })
  };

  render = () => {
    const { categoryId, disabled = false } = this.props;
    return (
      <div className="input-section-content">
        <input
          type="text"
          disabled={ disabled }
          name={ categoryId }
          onChange={ this.onInputChange }
          value={ this.state.value }
        />
        <button
          name={ categoryId }
          className="btn btn-default"
          disabled={ disabled }
          onClick={ this.onApplyChanges }
        >
          { APPLY_BTN_TEXT }
        </button>
      </div>
    );
  }
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ onApplyChanges: updateSingleOption }, dispatch);
};

export default connect<{}, DispatchFromProps, StateFromProps>(null, mapDispatchToProps)(InputFilter);
