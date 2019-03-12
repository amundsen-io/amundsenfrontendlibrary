import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

const DEFAULT_SUBTEXT = `Search within a category using the pattern with wildcard support 'category:*searchTerm*', e.g. 'schema:*core*'.
  Current categories are 'column', 'schema', 'table', and 'tag'.`;

interface SearchBarProps {
  handleValueSubmit: (term: string) => void;
  placeholder?: string;
  searchTerm?: string;
  subText?: string;
}

interface SearchBarState {
  optionalSubTextClass: string;
  searchTerm: string;
  subText: string;
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  private inputRef: React.RefObject<HTMLInputElement>;

  public static defaultProps: SearchBarProps = {
    handleValueSubmit: () => undefined,
    placeholder: 'Search for data resources...', // TODO: Hard-coded text strings should be translatable/customizable
    searchTerm: '',
    subText: DEFAULT_SUBTEXT,
  };

  constructor(props) {
    super(props);

    this.state = {
      optionalSubTextClass: '',
      searchTerm: this.props.searchTerm,
      subText: this.props.subText,
    };

    this.inputRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { searchTerm } = nextProps;
    return { searchTerm };
  }

  handleValueSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.isFormValid()) {
      const inputElement = this.inputRef.current;
      this.props.handleValueSubmit(inputElement.value.toLowerCase());
    }
  };

  handleValueChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: (event.target as HTMLInputElement).value.toLowerCase() });
  };

  isFormValid = () => {
    const searchTerm = this.state.searchTerm;

    const hasAtMostOneCategory = searchTerm.split(':').length <= 2;
    if (!hasAtMostOneCategory) {
      this.setState({
        subText: "Advanced search syntax only supports searching one category. Please remove all extra ':'",
        optionalSubTextClass: "error"
      });
      return false;
    }

    const colonIndex = searchTerm.indexOf(':');
    const hasNoSpaceAroundColon = colonIndex < 0 ||
      (colonIndex >= 1 && searchTerm.charAt(colonIndex+1) !== " " &&  searchTerm.charAt(colonIndex-1) !== " ");
    if (!hasNoSpaceAroundColon) {
      this.setState({
        subText: `Did you mean '${searchTerm.substring(0,colonIndex).trim()}:${searchTerm.substring(colonIndex+1).trim()}' ?
                  Please remove the space around the ':'.`,
        optionalSubTextClass: "error"
      });
      return false;
    }

    this.setState({ subText: DEFAULT_SUBTEXT, optionalSubTextClass: "" });
    return true;
  };

  render() {
    const subTextClass = `subtext ${this.state.optionalSubTextClass}`;
    return (
      <div className="col-xs-12">
        <div id="searchBar" className="search-bar">
          <form id="searchForm" onSubmit={ this.handleValueSubmit }>
            <div id="inputContainer" className="input-container">
              <button id="searchButton" type="submit" className="btn icon" />
              <input
               id="searchInput"
               value={ this.state.searchTerm }
               onChange={ this.handleValueChange }
               aria-label={ this.props.placeholder }
               placeholder={ this.props.placeholder }
               autoFocus={ true }
               ref={ this.inputRef }
              />
            </div>
          </form>
        </div>
        <div className={ subTextClass }>
          { this.state.subText }
        </div>
      </div>
    );
  }
}

export default SearchBar;
