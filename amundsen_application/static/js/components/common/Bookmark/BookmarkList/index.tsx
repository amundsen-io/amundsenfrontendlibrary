import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from "ducks/rootReducer";

// import './styles.scss'
import { Bookmark } from "ducks/bookmark/types";
import ResourceListItem from "components/common/ResourceListItem";
import { Resource } from "components/common/ResourceListItem/types";



interface StateFromProps {
  myBookmarks: Bookmark[];
}

interface DispatchFromProps {

}

type BookmarkListProps = StateFromProps & DispatchFromProps;

interface BookmarkListState {
  isBookmarked: boolean;
}

class BookmarkList extends React.Component<BookmarkListProps, BookmarkListState> {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <>
        <div className="title-1">My Bookmarks</div>
        <ul className="list-group">
          {
            this.props.myBookmarks.map((resource, index) => {
              const logging = { index, source: 'Bookmarks' };
              return <ResourceListItem item={ resource as Resource } logging={ logging } key={ index } />;
            })
          }
        </ul>
      </>
    )
  }
}


const mapStateToProps = (state: GlobalState) => {
  return {
    myBookmarks: state.bookmarks.myBookmarks
  };
};

export default connect<StateFromProps>(mapStateToProps)(BookmarkList);
