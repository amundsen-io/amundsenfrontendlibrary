import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import { GlobalState } from 'ducks/rootReducer';
import { bindActionCreators } from 'redux';
import SearchPage from 'components/SearchPage';
import PopularTables from 'components/common/PopularTables';
import BookmarkList from 'components/common/Bookmark/BookmarkList';
import SearchBar from 'components/SearchPage/SearchBar';
import { RouteComponentProps } from 'react-router';

interface HomePageState {
}

export interface StateFromProps {
}

export interface DispatchFromProps {
}

export type HomePageProps = StateFromProps & DispatchFromProps & RouteComponentProps<any>;

export class HomePage extends React.Component<HomePageProps, HomePageState> {
  public static defaultProps: Partial<HomePageProps> = {};

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {};
  }

  componentDidMount() {
  }

  onSearchBarSubmit = (searchTerm: string): void => {
    const pathName = `/search?searchTerm=${searchTerm}&selectedTab=table&pageIndex=0`;
    this.props.history.push(pathName);
  };

  render() {
    return (
      <>
        <div className="container home-page">
          <div className="row">
            <div className="col-xs-12 col-md-offset-1 col-md-10">
              <div className="search-list-container">
                <SearchBar />
                <BookmarkList />
                <PopularTables />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default HomePage;
