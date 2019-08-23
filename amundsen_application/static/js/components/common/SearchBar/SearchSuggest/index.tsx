import * as React from 'react';

import ResourceSearchList from './ResourceSearchList';
import ResultsSuggestList from './ResultsSuggestList';

import { getDatabaseDisplayName, getDatabaseIconClass, indexUsersEnabled } from 'config/config-utils';
import { Resource, ResourceType, TableResource, UserResource } from 'interfaces';

import './styles.scss';

import * as CONSTANTS from './constants';

export interface SearchSuggestProps {
  onItemSelect: (event: Event) => void;
  searchTerm: string;
  resultsFromSearch: ResultsFromSearch;
}

export type ResultsFromSearch = {[type: string] : {results: Resource[], totalResults: number}};

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

  getResultsSuggestTitle = (resourceType: ResourceType): string => {
    switch (resourceType) {
      case ResourceType.table:
        return CONSTANTS.DATASETS;
      case ResourceType.user:
        return CONSTANTS.PEOPLE;
      default:
        return '';
    }
  };

  getTotalResultsForResource = (resourceType: ResourceType) : number => {
    return this.props.resultsFromSearch[resourceType].totalResults;
  };

  mapResourcesToSuggestedResult = (resourceType: ResourceType): SuggestedResult[] => {
    const results = this.props.resultsFromSearch[resourceType].results;
    return results.map((result) => {
      return {
        href: this.getSuggestedResultHref(resourceType, result),
        iconClass: this.getSuggestedResultIconClass(resourceType, result),
        subtitle: this.getSuggestedResultSubTitle(resourceType, result),
        title: this.getSuggestedResultTitle(resourceType, result),
        type: this.getSuggestedResultType(resourceType, result)
      }
    });
  };

  getSuggestedResultHref = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return `/table_detail/${table.cluster}/${table.database}/${table.schema_name}/${table.name}`;
      case ResourceType.user:
        const user = result as UserResource;
        return `/user/${user.user_id}`;
      default:
        return '';
    }
  };

  getSuggestedResultIconClass = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return getDatabaseIconClass(table.database);
      case ResourceType.user:
        return 'icon-users';
      default:
        return '';
    }
  };

  getSuggestedResultSubTitle = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return table.description;
      case ResourceType.user:
        const user = result as UserResource;
        // TODO: Display role_name and location when support exists
        return user.team_name;
      default:
        return '';
    }
  };

  getSuggestedResultTitle = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return `${table.schema_name}.${table.name}`;
      case ResourceType.user:
        const user = result as UserResource;
        return user.display_name;
      default:
        return '';
    }
  };

  getSuggestedResultType = (resourceType: ResourceType, result: Resource): string => {
    switch (resourceType) {
      case ResourceType.table:
        const table = result as TableResource;
        return getDatabaseDisplayName(table.database);
      case ResourceType.user:
        return 'User';
      default:
        return '';
    }
  };

  render() {
    const { onItemSelect, resultsFromSearch, searchTerm } = this.props;
    return (
      <div id="search-suggest" className="search-suggest">
        <div className="search-suggest-section">
          <ResourceSearchList
            onItemSelect={onItemSelect}
            searchTerm={searchTerm}
          />
        </div>
        <div className="search-suggest-section">
          <ResultsSuggestList
            onItemSelect={onItemSelect}
            resourceType={ResourceType.table}
            searchTerm={searchTerm}
            suggestedResults={this.mapResourcesToSuggestedResult(ResourceType.table)}
            totalResults={this.getTotalResultsForResource(ResourceType.table)}
            title={this.getResultsSuggestTitle(ResourceType.table)}
          />
        </div>
        {
          indexUsersEnabled() &&
          <div className="search-suggest-section">
            <ResultsSuggestList
              onItemSelect={onItemSelect}
              resourceType={ResourceType.user}
              searchTerm={searchTerm}
              suggestedResults={this.mapResourcesToSuggestedResult(ResourceType.user)}
              totalResults={this.getTotalResultsForResource(ResourceType.user)}
              title={this.getResultsSuggestTitle(ResourceType.user)}
            />
          </div>
        }
      </div>
    );
  }
}

export default SearchSuggest;
