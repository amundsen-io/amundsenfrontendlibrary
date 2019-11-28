import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GlobalState } from 'ducks/rootReducer';

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
  onFilterChange: () => any;
}

export type SearchFilterProps = StateFromProps & DispatchFromProps;

export class SearchFilter extends React.Component<SearchFilterProps> {
  constructor(props) {
    super(props);
  }

  createCheckBoxItem = (item: SearchFilterInput, categoryId: string, key: string) => {
    const dummyMethod = () => { console.log('Dispatched') };
    const { checked, labelText, value } = item;
    return (
      <CheckBoxItem
        key={key}
        checked={ checked }
        name={ categoryId }
        value={ value }
        onChange={ dummyMethod }>
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

// TODO (ttannis): Improve this and put this in utils
function createFilterCheckBoxSection(resourceType: ResourceType) {
  const filterCategories = AppConfig.resourceConfig[resourceType].filterCategories;
  if (!filterCategories) {
    return [];
  }
  const checkBoxSections = [];
  filterCategories.forEach((categoryConfig) => {
    checkBoxSections.push({
      title: categoryConfig.displayName,
      categoryId: categoryConfig.value,
      inputProperties: generateDatasetOptions(categoryConfig),
    });
  });
  return checkBoxSections;
};

// TODO (ttannis): Improve this and put in utils
function generateDatasetOptions(categoryConfig): SearchFilterInput[] {
  const dataSetInputs = [];
  categoryConfig.options.forEach((option) => {
    dataSetInputs.push({
      value: option.value,
      labelText: option.displayName,
      checked: false,
    });
  })
  return dataSetInputs;
};

export const mapStateToProps = (state: GlobalState) => {
  return {
    checkBoxSections: createFilterCheckBoxSection(state.search.selectedTab)
  };
};

/*
  TODO: Dispatch a real action
*/
export const mapDispatchToProps = (dispatch: any) => {
  // return bindActionCreators({ onFilterChange } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps)(SearchFilter);
