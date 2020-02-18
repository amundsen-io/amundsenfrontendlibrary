import * as React from 'react';
import { connect } from 'react-redux';

import { clearFilterByCategory, updateFilterByCategory } from 'ducks/search/filters/reducer';

import { APPLY_BTN_TEXT } from '../constants';

interface StateFromProps {
  categoryId: string;
  value: string;
}

interface DispatchFromProps {
  onApplyChanges: (category: string, value: string) => void;
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

  componentDidUpdate = (prevProps: StateFromProps) => {
    const newValue = this.props.value;
    if (prevProps.value !== newValue) {
      this.setState({ value: newValue || '' });
    }
  };

  onApplyChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onApplyChanges(this.props.categoryId, this.state.value);
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value })
  };

  render = () => {
    const { categoryId } = this.props;
    return (
      <form className="input-section-content form-group" onSubmit={ this.onApplyChanges }>
        <input
          type="text"
          className="form-control"
          name={ categoryId }
          onChange={ this.onInputChange }
          value={ this.state.value }
        />
        <button
          name={ categoryId }
          className="btn btn-default"
          type="submit"
        >
          { APPLY_BTN_TEXT }
        </button>
      </form>
    );
  }
};

export const mapDispatchToProps = (dispatch: any) => {
  return {
    onApplyChanges: (categoryId, value) => {
      if (!!value) {
        dispatch(updateFilterByCategory(categoryId, value));
      }
      else {
        dispatch(clearFilterByCategory(categoryId));
      }
    },
  };
};

export default connect<{}, DispatchFromProps, StateFromProps>(null, mapDispatchToProps)(InputFilter);
