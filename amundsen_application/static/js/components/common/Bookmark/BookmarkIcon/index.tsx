import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from "ducks/rootReducer";

import './styles.scss'
import { addBookmark, removeBookmark } from "ducks/bookmark/reducer";
import { AddBookmarkRequest, RemoveBookmarkRequest } from "ducks/bookmark/types";


interface StateFromProps {
  isBookmarked: boolean;
}

interface DispatchFromProps {
  addBookmark: (key: string, type: string) => AddBookmarkRequest,
  removeBookmark: (key: string, type: string) => RemoveBookmarkRequest,
}

interface OwnProps {
  bookmarkKey: string;
}

type BookmarkIconProps = StateFromProps & DispatchFromProps & OwnProps;

interface BookmarkIconState {
  isBookmarked: boolean;
}

class BookmarkIcon extends React.Component<BookmarkIconProps, BookmarkIconState> {
  constructor(props) {
    super(props);
  }


  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (this.props.isBookmarked) {
      this.props.removeBookmark(this.props.bookmarkKey, 'table');
    } else {
      this.props.addBookmark(this.props.bookmarkKey, 'table');
    }
  };


  render() {
    return (
      <div className="bookmark-icon" onClick={ this.handleClick }>
        <img className={"icon " + (this.props.isBookmarked ? "icon-bookmark-filled" : "icon-bookmark")}/>
      </div>
    )
  }
}


const mapStateToProps = (state: GlobalState, ownProps: OwnProps) => {
  let bookmarkKey = ownProps.bookmarkKey;
  let isBookmarked = state.bookmarks.myBookmarks.some((bookmark) => bookmark.key == bookmarkKey);
  return {
    bookmarkKey,
    isBookmarked
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ addBookmark, removeBookmark } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BookmarkIcon);
