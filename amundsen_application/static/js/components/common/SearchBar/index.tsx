import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { searchAll } from 'ducks/search/reducer';
import {
  SearchAllRequest,
  TableSearchResults,
  UserSearchResults,
} from 'ducks/search/types';
import { GlobalState } from 'ducks/rootReducer';

import { Resource, ResourceType, TableResource, UserResource } from 'interfaces';

import SearchSuggest from './SearchSuggest';
import { getDatabaseDisplayName, getDatabaseIconClass } from 'config/config-utils';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import {
  BUTTON_CLOSE_TEXT,
  ERROR_CLASSNAME,
  PLACEHOLDER_DEFAULT,
  SIZE_SMALL,
  SUBTEXT_DEFAULT,
  SYNTAX_ERROR_CATEGORY,
  SYNTAX_ERROR_PREFIX,
  SYNTAX_ERROR_SPACING_SUFFIX,
} from './constants';

export interface StateFromProps {
  searchTerm: string;
  tables: TableSearchResults;
  users: UserSearchResults;
}

export interface DispatchFromProps {
  // TODO: Won't need selectedTab or pageIndex?
  onInputChange: (term: string, selectedTab: ResourceType, pageIndex: number) => SearchAllRequest;
}

export interface OwnProps {
  placeholder?: string;
  subText?: string;
  size?: string;
}

export type SearchBarProps = StateFromProps & DispatchFromProps & OwnProps & RouteComponentProps<any>;

interface SearchBarState {
  showTypeAhead: boolean;
  subTextClassName: string;
  searchTerm: string;
  subText: string;
}
// TODO: Close the typeahead when selecting an option
export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  private refToSelf: React.RefObject<HTMLDivElement>;

  public static defaultProps: Partial<SearchBarProps> = {
    placeholder: PLACEHOLDER_DEFAULT,
    subText: SUBTEXT_DEFAULT,
    size: '',
  };

  constructor(props) {
    super(props);
    this.refToSelf = React.createRef<HTMLDivElement>();

    this.state = {
      showTypeAhead: false,
      subTextClassName: '',
      searchTerm: this.props.searchTerm,
      subText: this.props.subText,
    };
  }

  componentWillMount = () => {
    document.addEventListener('mousedown', this.updateTypeAhead, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.updateTypeAhead, false);
  }

  shouldShowTypeAhead = (searchTerm: string) : boolean => {
    return searchTerm.length > 0;
  }

  updateTypeAhead = (event: Event): void => {
    if (this.refToSelf.current.contains(event.target as Node)) {
      this.setState({ showTypeAhead: this.shouldShowTypeAhead(this.state.searchTerm) });
    } else {
      this.setState({ showTypeAhead: false });
    }
  };

  clearSearchTerm = (event: React.SyntheticEvent<HTMLButtonElement>) : void => {
    this.setState({ showTypeAhead: false, searchTerm: '' });
  };

  onTypeAheadSelect = (event: Event) : void => {
    this.setState({showTypeAhead: false});
  }

  handleValueChange = (event: React.SyntheticEvent<HTMLInputElement>) : void => {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    const showTypeAhead = this.shouldShowTypeAhead(searchTerm);
    this.setState({ searchTerm, showTypeAhead });

    if (showTypeAhead) {
      /* TODO: Needs Redux work. To prevent the SearchPage from updating for
         intermediate calls. Consider dispatching an action of another name that will
         call search and control an `isIntermediate` boolean flag on the search state
         or manage `intermediateResults` arrays on the search state. */
      this.props.onInputChange(searchTerm, ResourceType.table, 0);
    }
  };

  handleValueSubmit = (event: React.FormEvent<HTMLFormElement>) : void => {
    const searchTerm = this.state.searchTerm.trim();
    event.preventDefault();
    if (this.isFormValid(searchTerm)) {
      let pathName = '/';
      if (searchTerm !== '') {
        pathName = `/search?searchTerm=${searchTerm}`;
      }
      this.props.history.push(pathName);
    }
  };

  isFormValid = (searchTerm: string) : boolean => {
    const hasAtMostOneCategory = searchTerm.split(':').length <= 2;
    if (!hasAtMostOneCategory) {
      this.setState({
        subText: SYNTAX_ERROR_CATEGORY,
        subTextClassName: ERROR_CLASSNAME,
      });
      return false;
    }

    const colonIndex = searchTerm.indexOf(':');
    const hasNoSpaceAroundColon = colonIndex < 0 ||
      (colonIndex >= 1 && searchTerm.charAt(colonIndex+1) !== " " &&  searchTerm.charAt(colonIndex-1) !== " ");
    if (!hasNoSpaceAroundColon) {
      this.setState({
        subText: `${SYNTAX_ERROR_PREFIX}'${searchTerm.substring(0,colonIndex).trim()}:${searchTerm.substring(colonIndex+1).trim()}'${SYNTAX_ERROR_SPACING_SUFFIX}`,
        subTextClassName: ERROR_CLASSNAME,
      });
      return false;
    }

    this.setState({ subText: SUBTEXT_DEFAULT, subTextClassName: "" });
    return true;
  };

  mapResourcesToSuggestedResult = (resourceType: ResourceType, results: Resource[]) => {
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
    const inputClass = `${this.props.size === SIZE_SMALL ? 'h3 small' : 'h2 large'} search-bar-input form-control`;
    const searchButtonClass = `btn btn-flat-icon search-button ${this.props.size === SIZE_SMALL ? 'small' : 'large'}`;
    const subTextClass = `subtext body-secondary-3 ${this.state.subTextClassName}`;

    const suggestedResults = {
      [ResourceType.table]: {
        results: this.mapResourcesToSuggestedResult(ResourceType.table, this.props.tables.results.slice(0, 2)),
        totalResults: this.props.tables.total_results,
      },
      [ResourceType.user]: {
        results: this.mapResourcesToSuggestedResult(ResourceType.user, this.props.users.results.slice(0, 2)),
        totalResults: this.props.users.total_results,
      }
    };
    return (
      <div id="search-bar" ref={this.refToSelf}>
        <form className="search-bar-form" onSubmit={ this.handleValueSubmit }>
            <input
              id="search-input"
              className={ inputClass }
              value={ this.state.searchTerm }
              onChange={ this.handleValueChange }
              aria-label={ this.props.placeholder }
              placeholder={ this.props.placeholder }
              autoFocus={ true }
              autoComplete="off"
            />
          <button className={ searchButtonClass } type="submit">
            <img className="icon icon-search" />
          </button>
          {
            this.props.size === SIZE_SMALL &&
            <button type="button" className="btn btn-close clear-button" aria-label={BUTTON_CLOSE_TEXT} onClick={this.clearSearchTerm} />
          }
        </form>
        {
          this.state.showTypeAhead &&
          <SearchSuggest
            onItemSelect={this.onTypeAheadSelect}
            searchTerm={this.state.searchTerm}
            suggestedResults={suggestedResults}
          />
        }
        {
          this.props.size !== SIZE_SMALL &&
          <div className={ subTextClass }>
            { this.state.subText }
          </div>
        }
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    searchTerm: state.search.search_term,
    tables: state.search.tables,
    users: state.search.users,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ onInputChange: searchAll }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(mapStateToProps,  mapDispatchToProps)(withRouter(SearchBar));
