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

interface FilterSection {
  categoryId: string;
  helpText?: string;
  title: string;
}

interface CheckboxFilterSection extends FilterSection {
  properties: CheckboxFilterProperties[];
}

interface InputFilterSection extends FilterSection {
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
    const { categoryId, helpText, properties, title } = section;
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
        helpText={ helpText }
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
    const { categoryId, helpText, title, value } = section;
    return (
      <FilterSection
        key={key}
        categoryId={ categoryId }
        hasValue={ value.length > 0 }
        helpText={ helpText }
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
          helpText: categoryConfig.helpText,
          properties: categoryConfig.options.map((option) => {
            return {
              value: option.value,
              labelText: option.displayName,
              /* tertiary statement allows for 'false' to be explicity set as opposed to 'undefined' */
              checked: currentFilterValue && currentFilterValue[option.value] ? true : false,
            };
          })
        });
      }
    });

    /* input sections */
    filterCategories.forEach((categoryConfig) => {
      currentFilterValue = filterState[resourceType][categoryConfig.value] || '';
      if (categoryConfig.type === FilterType.SINGLE_VALUE) {
        inputSections.push({
          categoryId: categoryConfig.value,
          helpText: categoryConfig.helpText,
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
