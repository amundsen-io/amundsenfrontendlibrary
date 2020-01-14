import * as React from 'react';
import { connect } from 'react-redux';

import { GlobalState } from 'ducks/rootReducer';
import { clearFilterByCategory, FilterReducerState } from 'ducks/search/filters/reducer';

import CheckBoxFilter, { CheckboxFilterProperties } from './CheckBoxFilter';
import FilterSection from './FilterSection';
import InputFilter from './InputFilter';

import { getFilterConfigByResource } from 'config/config-utils';

import { FilterType, ResourceType } from 'interfaces';

import './styles.scss'

interface CheckboxFilterSection {
  categoryId: string;
  properties: CheckboxFilterProperties[];
  title: string;
}

interface InputFilterSection {
  categoryId: string;
  title: string;
  value: string;
}

export interface StateFromProps {
  checkBoxSections: CheckboxFilterSection[];
  inputSections: InputFilterSection[];
}

export type SearchFilterProps = StateFromProps;

export class SearchFilter extends React.Component<SearchFilterProps> {
  constructor(props) {
    super(props);
  }

  createCheckBoxSection = (key: string, section: CheckboxFilterSection) => {
    const { categoryId, properties, title } = section;
    let hasChecked = false;
    properties.forEach((item) => {
      if (item.checked) {
        hasChecked = true;
      }
    });
    return (
      <FilterSection
        key={key}
        categoryId={ categoryId }
        hasValue={ hasChecked }
        title={ title }
      >
        <CheckBoxFilter
          categoryId={categoryId}
          checkboxProperties={properties}
        />
      </FilterSection>
    );
  };

  createInputSection = (key: string, section: InputFilterSection) => {
    const { categoryId, title, value } = section;
    return (
      <FilterSection
        key={key}
        categoryId={ categoryId }
        hasValue={ value && value.length > 0 }
        title={ title }
      >
        <InputFilter
          categoryId={ categoryId }
          value={ value }
        />
      </FilterSection>
    )
  };

  renderCheckBoxFilters = () => {
    return this.props.checkBoxSections.map((section) => this.createCheckBoxSection(`section:${section.categoryId}`, section));
  };

  renderInputFilters = () => {
    return this.props.inputSections.map((section) => this.createInputSection(`section:${section.categoryId}`, section));
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
  const inputSections = [];

  let currentFilterValue;

  if (filterCategories) {
    /* checkbox sections */
    filterCategories.forEach((categoryConfig) => {
      currentFilterValue = filterState[resourceType][categoryConfig.value];
      if (categoryConfig.type === FilterType.MULTI_SELECT_VALUE) {
        checkBoxSections.push({
          title: categoryConfig.displayName,
          categoryId: categoryConfig.value,
          properties: categoryConfig.options.map((option) => {
            return {
              value: option.value,
              labelText: option.displayName,
              checked: currentFilterValue && currentFilterValue[option.value],
            };
          })
        });
      }
    });

    /* input sections */
    filterCategories.forEach((categoryConfig) => {
      currentFilterValue = filterState[resourceType][categoryConfig.value];
      if (categoryConfig.type === FilterType.SINGLE_VALUE) {
        inputSections.push({
          categoryId: categoryConfig.value,
          title: categoryConfig.displayName,
          value: currentFilterValue,
        });
      }
    });
  }

  return {
    checkBoxSections,
    inputSections,
  };
};

export default connect<StateFromProps>(mapStateToProps, null)(SearchFilter);
