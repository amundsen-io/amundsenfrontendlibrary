import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import * as qs from 'simple-query-string';
import Pagination from 'react-js-pagination';

import SearchBar from './SearchBar';
import SearchList from './SearchList';
import InfoButton from '../common/InfoButton';
import { Resource, ResourceType, TableResource } from "../common/ResourceListItem/types";

import {
  DashboardSearchResults,
  SearchAllOptions,
  SearchAllRequest,
  SearchResourceRequest,
  TableSearchResults,
  UserSearchResults
} from "../../ducks/search/types";
import { GetPopularTablesRequest } from '../../ducks/popularTables/types';
// TODO: Use css-modules instead of 'import'
import './styles.scss';
import TabsComponent from "../common/Tabs";

const RESULTS_PER_PAGE = 10;

export interface StateFromProps {
  searchTerm: string;
  popularTables: TableResource[];

  tables: TableSearchResults;
  dashboards: DashboardSearchResults
  users: UserSearchResults;
}

export interface DispatchFromProps {
  searchAll: (term: string, options: SearchAllOptions) => SearchAllRequest;
  searchResource: (resource: ResourceType, term: string, pageIndex: number) => SearchResourceRequest;
  getPopularTables: () => GetPopularTablesRequest;
}

type SearchPageProps = StateFromProps & DispatchFromProps;

interface SearchPageState {
  selectedTab: ResourceType;
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  public static defaultProps: SearchPageProps = {
    searchAll: () => undefined,
    searchResource: () => undefined,
    getPopularTables: () => undefined,
    searchTerm: '',
    popularTables: [],
    dashboards: {
      page_index: 0,
      results: [],
      total_results: 0,
    },
    tables: {
      page_index: 0,
      results: [],
      total_results: 0,
    },
    users: {
      page_index: 0,
      results: [],
      total_results: 0,
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: ResourceType.table,
    };
  }

  componentDidMount() {
    this.props.getPopularTables();

    const params = qs.parse(window.location.search);
    const { searchTerm, pageIndex, selectedTab} = params;

    this.updateSelectedTab(selectedTab);
    if (searchTerm && searchTerm.length > 0) {
      const index = pageIndex || '0';
      this.props.searchAll(searchTerm, this.getSearchOptions(index));
    }
  }

  updateSelectedTab = (newTab) => {
    switch(newTab) {
      case ResourceType.table:
      case ResourceType.user:
        this.setState({ selectedTab: newTab });
        break;
      case ResourceType.dashboard:
        break;
    }
  };

  getSearchOptions = (pageIndex) => {
    return {
      dashboardIndex: (this.state.selectedTab === ResourceType.dashboard) ? pageIndex : 0,
      userIndex: (this.state.selectedTab === ResourceType.user) ? pageIndex : 0,
      tableIndex: (this.state.selectedTab === ResourceType.table) ? pageIndex : 0,
    };
  };

  getPageIndex = (tab) => {
    switch(tab) {
      case ResourceType.table:
        return this.props.tables.page_index;
      case ResourceType.user:
        return this.props.users.page_index;
      case ResourceType.dashboard:
        return this.props.dashboards.page_index;
    }
    return 0;
  };

  onSearchBarSubmit = (searchTerm: string) => {
    this.props.searchAll(searchTerm, this.getSearchOptions(0));
    this.updatePageUrl(searchTerm, this.state.selectedTab,0);
  };

  onPaginationChange = (pageNumber) => {
    // subtract 1 : pagination component indexes from 1, while our api is 0-indexed
    const index = pageNumber - 1;

    this.props.searchResource(this.state.selectedTab, this.props.searchTerm, index);
    this.updatePageUrl(this.props.searchTerm, this.state.selectedTab, index);
  };

  onTabChange = (tab: ResourceType) => {
    this.updateSelectedTab(tab);
    this.updatePageUrl(this.props.searchTerm, tab, this.getPageIndex(tab));
  };

  updatePageUrl = (searchTerm, tab, pageIndex) => {
    const pathName = `/search?searchTerm=${searchTerm}&selectedTab=${tab}&pageIndex=${pageIndex}`;
    window.history.pushState({}, '', `${window.location.origin}${pathName}`);
  };

  renderPopularTables = () => {
    const searchListParams = {
      source: 'popular_tables',
      paginationStartIndex: 0,
    };
    return (
        <div className="col-xs-12">
          <div className="search-list-container">
            <div className="search-list-header">
              <label>Popular Tables</label>
              <InfoButton infoText={ "These are some of the most commonly accessed tables within your organization." }/>
            </div>
            <SearchList results={ this.props.popularTables } params={ searchListParams }/>
          </div>
        </div>
      )
  };


  // TODO - Modify for each resource type
  createErrorMessage() {
    const items = this.props.tables;
    const { page_index, total_results } = items;
    const { searchTerm } = this.props;
    if (total_results === 0 && searchTerm.length > 0) {
      return (
        <label>
          Your search - <i>{ searchTerm }</i> - did not match any tables.
        </label>
      )
    }
    if (total_results > 0 && (RESULTS_PER_PAGE * page_index) + 1 > total_results) {
      return (
        <label>
          Page index out of bounds for available matches.
        </label>
      )
    }
    return null;
  }

  renderSearchResults = () => {
    const errorMessage = this.createErrorMessage();
    if (errorMessage) {
      return (
        <div className="col-xs-12">
          <div className="search-list-container">
            <div className="search-list-header">
              { errorMessage }
            </div>
          </div>
        </div>
      )
    }

    const tabConfig = [
      {
        title: `Tables (${ this.props.tables.total_results })`,
        key: ResourceType.table,
        content: this.getTabContent(this.props.tables),
      },
      {
        title: `Users (${ this.props.users.total_results })`,
        key: ResourceType.user,
        content: this.getTabContent(this.props.users),
      },
    ];

    return (
      <div className="col-xs-12">
        <TabsComponent
          tabs={ tabConfig }
          defaultTab={ ResourceType.table }
          activeKey={ this.state.selectedTab }
          onSelect={ this.onTabChange }
        />
      </div>
    );
  };


  // TODO: Hard-coded text strings should be translatable/customizable
  getTabContent = (results) => {
    const startIndex = (RESULTS_PER_PAGE * results.page_index) + 1;
    const endIndex = RESULTS_PER_PAGE * ( results.page_index + 1);
    let title =`${startIndex}-${Math.min(endIndex, results.total_results)} of ${results.total_results} results`;

    return (
      <div className="search-list-container">
        <div className="search-list-header">
          <label>{ title }</label>
          <InfoButton infoText={ "Ordered by the relevance of matches within a resource's metadata, as well as overall usage." }/>
        </div>
        <SearchList results={ results.results } params={ {source: 'search_results', paginationStartIndex: 0 } }/>
        <div className="search-pagination-component">
            {
              results.total_results > RESULTS_PER_PAGE &&
              <Pagination
                activePage={ results.page_index + 1 }
                itemsCountPerPage={ RESULTS_PER_PAGE }
                totalItemsCount={ results.total_results }
                pageRangeDisplayed={ 10 }
                onChange={ this.onPaginationChange }
              />
            }
          </div>
      </div>
      );
  };

  render() {
    const { searchTerm } = this.props;
    const innerContent = (
      <div className="container search-page">
        <div className="row">
          <SearchBar handleValueSubmit={ this.onSearchBarSubmit } searchTerm={ searchTerm }/>
          { searchTerm.length > 0 && this.renderSearchResults() }
          { searchTerm.length === 0 && this.renderPopularTables()  }
        </div>
      </div>
    );
    if (searchTerm !== undefined && searchTerm.length > 0) {
      return (
        <DocumentTitle title={ searchTerm + " - Amundsen Search" }>
          { innerContent }
        </DocumentTitle>
      );
    }
    return innerContent;
  }
}

export default SearchPage;
