import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import { bindActionCreators } from 'redux';
import PopularTables from 'components/common/PopularTables';
import BookmarkList from 'components/common/Bookmark/BookmarkList';
import SearchBar from 'components/SearchPage/SearchBar';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { SearchAllReset } from 'ducks/search/types';
import { searchReset } from 'ducks/search/reducer';
import { ResourceType } from 'components/common/ResourceListItem/types';

export interface DispatchFromProps {
  searchReset: () => SearchAllReset;
}

export type HomePageProps = DispatchFromProps & RouteComponentProps<any>;

export class HomePage extends React.Component<HomePageProps> {
  constructor(props) {
    super(props);
  }

  createSearchOptions = (pageIndex: number, selectedTab: ResourceType) => {
    return {
      dashboardIndex: (selectedTab === ResourceType.dashboard) ? pageIndex : 0,
      userIndex: (selectedTab === ResourceType.user) ? pageIndex : 0,
      tableIndex: (selectedTab === ResourceType.table) ? pageIndex : 0,
    };
  };
  
  componentDidMount() {
    this.props.searchReset();
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

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ searchReset } , dispatch);
};

export default connect<DispatchFromProps>(null, mapDispatchToProps)(HomePage);
