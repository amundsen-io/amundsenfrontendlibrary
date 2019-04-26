import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

// TODO: Hard-coded text strings should be translatable/customizable
export const PLACEHOLDER_DEFAULT = 'search for data resources...';
export const SUBTEXT_DEFAULT = `Search within a category using the pattern with wildcard support 'category:*searchTerm*', e.g. 'schema:*core*'.
  Current categories are 'column', 'schema', 'table', and 'tag'.`;
export const SUBTEXT_EXTRA_COLON_ERROR = "Advanced search syntax only supports searching one category. Please remove all extra ':'";
export const ERROR_CLASSNAME = "error";

export interface SearchBarProps {
  handleValueSubmit: (term: string) => void;
  placeholder?: string;
  searchTerm?: string;
  subText?: string;
}

interface SearchBarState {
  subTextClassName: string;
  searchTerm: string;
  subText: string;
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  public static defaultProps: Partial<SearchBarProps> = {
    placeholder: PLACEHOLDER_DEFAULT,
    searchTerm: '',
    subText: SUBTEXT_DEFAULT,
  };

  constructor(props) {
    super(props);

    this.state = {
      subTextClassName: '',
      searchTerm: this.props.searchTerm,
      subText: this.props.subText,
    };
  }

  handleValueChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: (event.target as HTMLInputElement).value.toLowerCase() });
  };

  handleValueSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.props.handleValueSubmit(this.state.searchTerm);
    }
  };

  isFormValid = () => {
    const searchTerm = this.state.searchTerm;

    const hasAtMostOneCategory = searchTerm.split(':').length <= 2;
    if (!hasAtMostOneCategory) {
      this.setState({
        subText: SUBTEXT_EXTRA_COLON_ERROR,
        subTextClassName: ERROR_CLASSNAME,
      });
      return false;
    }

    const colonIndex = searchTerm.indexOf(':');
    const hasNoSpaceAroundColon = colonIndex < 0 ||
      (colonIndex >= 1 && searchTerm.charAt(colonIndex+1) !== " " &&  searchTerm.charAt(colonIndex-1) !== " ");
    if (!hasNoSpaceAroundColon) {
      this.setState({
        subText: `Did you mean '${searchTerm.substring(0,colonIndex).trim()}:${searchTerm.substring(colonIndex+1).trim()}' ? Please remove the space around the ':'.`,
        subTextClassName: ERROR_CLASSNAME,
      });
      return false;
    }

    this.setState({ subText: SUBTEXT_DEFAULT, subTextClassName: "" });
    return true;
  };

  render() {
    const subTextClass = `subtext ${this.state.subTextClassName}`;
    return (
      <div id="search-bar" className="col-xs-12 col-md-offset-1 col-md-10">
        <form className="search-bar-form" onSubmit={ this.handleValueSubmit }>
            <input
              id="search-input"
              className="search-bar-input form-control"
              value={ this.state.searchTerm }
              onChange={ this.handleValueChange }
              aria-label={ this.props.placeholder }
              placeholder={ this.props.placeholder }
              autoFocus={ true }
            />
          <button className="btn btn-flat-icon search-bar-button" type="submit">
            <img className="icon icon-search" />
          </button>
        </form>
        <div className={ subTextClass }>
          { this.state.subText }
        </div>
      </div>
    );
  }
}

export default SearchBar;
