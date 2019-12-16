import * as React from 'react';
import { connect } from 'react-redux';

import { addMultiSelectOption, removeMultiSelectOption } from 'ducks/search/filters/reducer';

import CheckBoxItem from 'components/common/Inputs/CheckBoxItem';

export interface CheckboxFilterProperties {
  checked: boolean;
  labelText: string;
  value: string;
}

interface StateFromProps {
  categoryId: string;
  properties: CheckboxFilterProperties[];
}

interface DispatchFromProps {
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type CheckBoxFilterProps = StateFromProps & DispatchFromProps;

export class CheckBoxFilter extends React.Component<CheckBoxFilterProps> {
  constructor(props) {
    super(props);
  }

  createCheckBoxItem = (categoryId: string, key: string, item: CheckboxFilterProperties) => {
    const { checked, labelText, value } = item;
    return (
      <CheckBoxItem
        key={key}
        checked={ checked || false }
        name={ categoryId }
        value={ value }
        onChange={ this.props.onCheckboxChange }>
          <span className="subtitle-2">{ labelText }</span>
      </CheckBoxItem>
    );
  };

  render = () => {
    const { categoryId, properties } = this.props;
    return (
      <div className="checkbox-section-content">
        { properties.map((item, index) => this.createCheckBoxItem(categoryId, `item:${categoryId}:${index}`, item)) }
      </div>
    )
  }
};

export const mapDispatchToProps = (dispatch: any) => {
  return {
    onCheckboxChange: ((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const category = e.target.name;
      if (e.target.checked) {
        dispatch(addMultiSelectOption({ category, value }));
      }
      else {
        dispatch(removeMultiSelectOption({ category, value }))
      }
    }),
  }
};

export default connect<{}, DispatchFromProps, StateFromProps>(null, mapDispatchToProps)(CheckBoxFilter);
