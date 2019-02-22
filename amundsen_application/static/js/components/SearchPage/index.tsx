import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import * as qs from 'simple-query-string';
import Pagination from 'react-js-pagination';

import SearchBar from './SearchBar';
import SearchList from './SearchList';
import InfoButton from '../common/InfoButton';

import { ExecuteSearchRequest } from '../../ducks/search/reducer';
import { GetPopularTablesRequest } from '../../ducks/popularTables/reducer';
// TODO: Use css-modules instead of 'import'
import './styles.scss';
import {
  DashboardSearchResults,
  SearchResult,
  SearchResultType,
  TableSearchResults,
  UserSearchResults
} from "../../ducks/search/types";

const RESULTS_PER_PAGE = 10;

export interface StateFromProps {
  searchTerm: string;
  popularTables: SearchResult[];

  tables: TableSearchResults;
  dashboards: DashboardSearchResults
  users: UserSearchResults;
}

export interface DispatchFromProps {
  executeSearch: (term: string, page_index: number) => ExecuteSearchRequest;
  getPopularTables: () => GetPopularTablesRequest;
}

type SearchPageProps = StateFromProps & DispatchFromProps;

interface SearchPageState {
  page_index: number;
  searchTerm: string;
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  public static defaultProps: SearchPageProps = {
    executeSearch: () => undefined,
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

    this.handlePageChange = this.handlePageChange.bind(this);
    this.updateQueryString = this.updateQueryString.bind(this);
  }

  componentDidMount() {
    this.props.getPopularTables();

    const params = qs.parse(window.location.search);
    const searchTerm = params['searchTerm'];
    const page_index = params['page_index'];
    if (searchTerm && searchTerm.length > 0) {
      const index = page_index || '0';
      this.props.executeSearch(searchTerm, index);
    }
  }

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

  handlePageChange(pageNumber) {
    // subtract 1 : pagination component indexes from 1, while our api is 0-indexed
    this.updateQueryString(this.props.searchTerm, pageNumber - 1);
  }

  updateQueryString(searchTerm, page_index) {
    const pathName = `/search?searchTerm=${searchTerm}&page_index=${page_index}`;
    window.history.pushState({}, '', `${window.location.origin}${pathName}`);
    this.props.executeSearch(searchTerm, page_index);
  }

  // TODO: Hard-coded text strings should be translatable/customizable
  renderSearchResults() {
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

    const items = this.props.tables;
    const { page_index, results, total_results } = items;
    const { popularTables } = this.props;

    const showResultsList = results.length > 0 || popularTables.length > 0;

    if (showResultsList) {
      const startIndex = (RESULTS_PER_PAGE * page_index) + 1;
      const endIndex = RESULTS_PER_PAGE * ( page_index + 1);
      const hasSearchResults = total_results > 0;
      const listTitle = hasSearchResults ?
        `${startIndex}-${Math.min(endIndex, total_results)} of ${total_results} results` :
        'Popular Tables';
      const infoText = hasSearchResults ?
        "Ordered by the relevance of matches within a resource's metadata, as well as overall usage." :
        "These are some of the most commonly accessed tables within your organization.";
      const searchListParams = {
        source: hasSearchResults ? 'search_results' : 'popular_tables',
        paginationStartIndex: RESULTS_PER_PAGE * page_index
      };

      return (
        <div className="col-xs-12">
          <div className="search-list-container">
            <div className="search-list-header">
              <label> { listTitle } </label>
              <InfoButton infoText={ infoText }/>
            </div>
            <SearchList results={ hasSearchResults ? results : popularTables } params={ searchListParams }/>
          </div>
          <div className="search-pagination-component">
            {
              total_results > RESULTS_PER_PAGE &&
              <Pagination
                activePage={ page_index + 1 }
                itemsCountPerPage={ RESULTS_PER_PAGE }
                totalItemsCount={ total_results }
                pageRangeDisplayed={ 10 }
                onChange={ this.handlePageChange }
              />
            }
          </div>
        </div>
      )
    }
  }

  // TODO: Hard-coded text strings should be translatable/customizable
  render() {
    const { searchTerm } = this.props;
    const innerContent = (
      <div className="container search-page">
        <div className="row">
          <SearchBar handleValueSubmit={ this.updateQueryString } searchTerm={ searchTerm }/>
          { this.renderSearchResults() }
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
