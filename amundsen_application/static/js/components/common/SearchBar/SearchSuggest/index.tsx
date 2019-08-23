import * as React from 'react';

import ResourceSearchList from './ResourceSearchList';
import ResultsSuggestList from './ResultsSuggestList';

import { indexUsersEnabled } from 'config/config-utils';
import { ResourceType } from 'interfaces';

import './styles.scss';

import * as CONSTANTS from './constants';

export interface SearchSuggestProps {
  onItemSelect: (event: Event) => void;
  searchTerm: string;
  suggestedResults: {[id: string] : {results: SuggestedResult[], totalResults: number}};
}

export interface SuggestedResult {
  href: string;
  iconClass: string;
  subtitle: string;
  title: string;
  type: string;
}

class SearchSuggest extends React.Component<SearchSuggestProps, {}> {
  constructor(props) {
    super(props);
  }

  getSuggestListTitle = (resourceType: ResourceType): string => {
    switch (resourceType) {
      case ResourceType.table:
        return CONSTANTS.DATASETS;
      case ResourceType.user:
        return CONSTANTS.PEOPLE;
      default:
        return '';
    }
  }

  render() {
    return (
      <div id="search-suggest" className="search-suggest">
        <div className="search-suggest-section">
          <ResourceSearchList
            onItemSelect={this.props.onItemSelect}
            searchTerm={this.props.searchTerm}
          />
        </div>
        <div className="search-suggest-section">
          <ResultsSuggestList
            onItemSelect={this.props.onItemSelect}
            resourceType={ResourceType.table}
            searchTerm={this.props.searchTerm}
            suggestedResults={this.props.suggestedResults[ResourceType.table].results}
            totalResults={this.props.suggestedResults[ResourceType.table].totalResults}
            title={this.getSuggestListTitle(ResourceType.table)}
          />
        </div>
        {
          indexUsersEnabled() &&
          <div className="search-suggest-section">
            <ResultsSuggestList
              onItemSelect={this.props.onItemSelect}
              resourceType={ResourceType.user}
              searchTerm={this.props.searchTerm}
              suggestedResults={this.props.suggestedResults[ResourceType.user].results}
              totalResults={this.props.suggestedResults[ResourceType.user].totalResults}
              title={this.getSuggestListTitle(ResourceType.user)}
            />
          </div>
        }
      </div>
    );
  }
}

export default SearchSuggest;
