import * as React from 'react';
import { connect } from 'react-redux';

import { clearFilterByCategory, updateFilterByCategory } from 'ducks/search/filters/reducer';

import CheckBoxItem from 'components/common/Inputs/CheckBoxItem';

export interface CheckboxFilterProperties {
  checked: boolean;
  labelText: string;
  value: string;
}

interface OwnProps {
  categoryId: string;
  properties: CheckboxFilterProperties[];
}

interface DispatchFromProps {
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type CheckBoxFilterProps = OwnProps & DispatchFromProps;

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

export const mapDispatchToProps = (dispatch: any, ownProps: OwnProps) => {
  return {
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const checkedValues = {};
      const value = e.target.value;
      const category = e.target.name;
      let shouldClearFilter = true;

      ownProps.properties.forEach((property) => {
        if ((property.value === value && e.target.checked) || (property.value !== value && property.checked)) {
          checkedValues[property.value] = true;
          shouldClearFilter = false;
        }
      });

      if (shouldClearFilter) {
        dispatch(clearFilterByCategory(category));
      }
      else {
        dispatch(updateFilterByCategory(category, checkedValues));
      }
    },
  }
};

export default connect<{}, DispatchFromProps, OwnProps>(null, mapDispatchToProps)(CheckBoxFilter);
