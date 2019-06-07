import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from "ducks/rootReducer";

import './styles.scss'
import { Bookmark } from "ducks/bookmark/types";
import {
  BOOKMARK_TITLE,
  BOOKMARKS_PER_PAGE,
  EMPTY_BOOKMARK_MESSAGE,
  MY_BOOKMARKS_SOURCE_NAME,
} from "./constants";
import ResourceList from "components/common/ResourceList";

interface StateFromProps {
  myBookmarks: Bookmark[];
  isLoaded: boolean;
}

export type MyBookmarksProps = StateFromProps;

interface MyBookmarksState {
  activePage: number;
}

export class MyBookmarks extends React.Component<MyBookmarksProps, MyBookmarksState> {
  constructor(props) {
    super(props);

    this.state = { activePage: 0 };
  }

  onPaginationChange = (pageNumber: number) => {
    this.setState({ activePage: pageNumber - 1 });
  };

  render() {
    if (!this.props.isLoaded) {
      return null;
    }

    const bookmarksLength = this.props.myBookmarks.length;
    return (
      <div className="bookmark-list">
        <div className="title-1">{ BOOKMARK_TITLE }</div>
        {
          bookmarksLength === 0 &&
          <div className="empty-message body-placeholder">
            { EMPTY_BOOKMARK_MESSAGE }
          </div>
        }
        {
          bookmarksLength !== 0 &&
          <ResourceList
            isFullList={ true }
            items={ this.props.myBookmarks }
            itemsPerPage={ BOOKMARKS_PER_PAGE }
            activePage={ this.state.activePage }
            onPagination={ this.onPaginationChange }
            source={ MY_BOOKMARKS_SOURCE_NAME }
          />
        }
      </div>
    );
  }
}


export const mapStateToProps = (state: GlobalState) => {
  return {
    myBookmarks: state.bookmarks.myBookmarks,
    isLoaded: state.bookmarks.myBookmarksIsLoaded,
  };
};

export default connect<StateFromProps>(mapStateToProps)(MyBookmarks);
