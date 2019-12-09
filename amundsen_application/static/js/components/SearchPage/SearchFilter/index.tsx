import * as React from 'react';
import { connect } from 'react-redux';

import { GlobalState } from 'ducks/rootReducer';
import { addMultiSelectOption, removeMultiSelectOption, FilterReducerState } from 'ducks/search/filters/reducer';

import CheckBoxItem from 'components/common/Inputs/CheckBoxItem';
import InputFilter from './InputFilter';

import { getFilterConfigByResource } from 'config/config-utils';

import { FilterType, ResourceType } from 'interfaces';

import './styles.scss'

interface CheckboxFilterProperties {
  value: string;
  labelText: string;
  checked: boolean;
}

interface CheckboxFilterSection {
  title: string;
  categoryId: string;
  properties: CheckboxFilterProperties[];
}

interface InputFilterProperties {
  title: string;
  value: string;
}

interface InputFilterSections {
  [categoryId: string]: InputFilterProperties;
}

export interface StateFromProps {
  checkBoxSections: CheckboxFilterSection[];
  inputSections: InputFilterSections;
}

export interface DispatchFromProps {
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type SearchFilterProps = StateFromProps & DispatchFromProps;

export class SearchFilter extends React.Component<SearchFilterProps> {
  constructor(props) {
    super(props);
  }

  createCheckBoxItem = (categoryId: string, key: string, item: CheckboxFilterProperties) => {
    const { checked, labelText, value } = item;
    return (
      <CheckBoxItem
        key={key}
        checked={ checked }
        name={ categoryId }
        value={ value }
        onChange={ this.props.onCheckboxChange }>
          <span className="subtitle-2">{ labelText }</span>
      </CheckBoxItem>
    );
  };

  createCheckBoxSection = (key: string, section: CheckboxFilterSection) => {
    const { categoryId, properties, title } = section;
    return (
      <div key={key} className="search-filter-section">
        <div className="title-2">{ title }</div>
        { properties.map((item, index) => this.createCheckBoxItem(categoryId, `item:${categoryId}:${index}`, item)) }
      </div>
    );
  };

  createInputSectionByCategoryId = (categoryId: string, key: string) => {
    const { value, title } = this.props.inputSections[categoryId];
    return (
      <div key={key} className="search-filter-section">
        <div className="title-2">{ title }</div>
        <div className="input-section-content">
          <InputFilter
            categoryId={ categoryId }
            value={ value }
          />
        </div>
      </div>
    )
  };

  renderCheckBoxFilters = () => {
    return this.props.checkBoxSections.map((section) => this.createCheckBoxSection(`section:${section.categoryId}`, section));
  };

  renderInputFilters = () => {
    return Object.keys(this.props.inputSections).map((categoryId, index) => {
      return this.createInputSectionByCategoryId(categoryId, `item:${categoryId}:${index}`);
    })
  };

  render = () => {
    return (
      <>
        { this.renderCheckBoxFilters() }
        { this.renderInputFilters() }
      </>
    )
  };
};

/*
  TODO (ttannis): Reminder don't write test tied to the implementation of the transformations.
  Create test fixtures for input, and test output is the expected output in the correct data shape.
*/
export const mapStateToProps = (state: GlobalState) => {
  const resourceType = state.search.selectedTab;
  const filterCategories = getFilterConfigByResource(resourceType);
  const filterState = state.search.filters;

  const checkBoxSections = [];
  const inputSections = {};

  if (filterCategories) {
    /* checkbox sections */
    filterCategories.forEach((categoryConfig) => {
      if (categoryConfig.type === FilterType.MULTI_SELECT_VALUE) {
        checkBoxSections.push({
          title: categoryConfig.displayName,
          categoryId: categoryConfig.value,
          properties: categoryConfig.options.map((option) => {
            return {
              value: option.value,
              labelText: option.displayName,
              checked: !!filterState[ResourceType.table].database[option.value],
            };
          })
        });
      }
    });

    /* input sections */
    filterCategories.forEach((categoryConfig) => {
      if (categoryConfig.type === FilterType.SINGLE_VALUE) {
        inputSections[categoryConfig.value] = {
          title: categoryConfig.displayName,
          value: filterState[resourceType][categoryConfig.value],
        }
      }
    });
  }

  return {
    checkBoxSections,
    inputSections,
  };
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
  };
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(SearchFilter);
