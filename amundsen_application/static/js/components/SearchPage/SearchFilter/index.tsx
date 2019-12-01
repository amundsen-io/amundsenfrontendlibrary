import * as React from 'react';
import { connect } from 'react-redux';

import { GlobalState } from 'ducks/rootReducer';
import { addFilter, removeFromFilter, FilterReducerState } from 'ducks/search/filters/reducer';

import CheckBoxItem from 'components/common/Inputs/CheckBoxItem';

import AppConfig from 'config/config';
import { AppConfig as AppConfigType } from 'config/config-types';

import { ResourceType } from 'interfaces';

import './styles.scss'

interface SearchFilterInput {
  value: string;
  labelText: string;
  checked: boolean;
}

interface SearchFilterSection {
  title: string;
  categoryId: string;
  inputProperties: SearchFilterInput[];
}

export interface StateFromProps {
  checkBoxSections: SearchFilterSection[];
}

export interface DispatchFromProps {
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type SearchFilterProps = StateFromProps & DispatchFromProps;

export class SearchFilter extends React.Component<SearchFilterProps> {
  constructor(props) {
    super(props);
  }

  createCheckBoxItem = (item: SearchFilterInput, categoryId: string, key: string) => {
    const { checked, labelText, value } = item;
    return (
      <CheckBoxItem
        key={key}
        checked={ checked }
        name={ categoryId }
        value={ value }
        onChange={ this.props.onFilterChange }>
          <span className="subtitle-2">{ labelText }</span>
      </CheckBoxItem>
    );
  };

  createCheckBoxSection = (section: SearchFilterSection, key: string) => {
    const { categoryId, inputProperties, title } = section;
    return (
      <div key={key} className="search-filter-section">
        <div className="title-2">{ title }</div>
        { inputProperties.map((item, index) => this.createCheckBoxItem(item, categoryId, `item:${categoryId}:${index}`)) }
      </div>
    );
  };

  render = () => {
    return this.props.checkBoxSections.map((section, index) => this.createCheckBoxSection(section, `section:${index}`));
    // TODO (ttannis): Let's deprecate adv. search syntax and add an input box for other categories -- tag, schema, table, column.
  };
};

function createFilterCheckBoxSection(filterState: FilterReducerState, resourceType: ResourceType): SearchFilterSection[] {
  const filterCategories = AppConfig.resourceConfig[resourceType].filterCategories;
  if (!filterCategories) {
    return [];
  }
  const checkBoxSections = [];
  filterCategories.forEach((categoryConfig) => {
    checkBoxSections.push({
      title: categoryConfig.displayName, // e.g. 'Type'
      categoryId: categoryConfig.value,  // e.g. 'database'
      inputProperties: generateDatasetOptions(categoryConfig, filterState),
    });
  });
  return checkBoxSections;
};

function generateDatasetOptions(categoryConfig, filterState: FilterReducerState): SearchFilterInput[] {
  const dataSetInputs = [];
  categoryConfig.options.forEach((option) => {
    dataSetInputs.push({
      value: option.value,
      labelText: option.displayName,
      checked: !!filterState[ResourceType.table].database[option.value],
    });
  })
  return dataSetInputs;
};

export const mapStateToProps = (state: GlobalState) => {
  return {
    checkBoxSections: createFilterCheckBoxSection(state.search.filters, state.search.selectedTab)
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return {
    onFilterChange: ((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const category = e.target.name;
      if (e.target.checked) {
        dispatch(addFilter({ category, value }));
      }
      else {
        dispatch(removeFromFilter({ category, value }))
      }
    }),
  };
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(SearchFilter);
