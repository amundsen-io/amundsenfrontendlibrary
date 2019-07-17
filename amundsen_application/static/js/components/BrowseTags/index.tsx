import * as React from 'react';
import TagsList from './TagsList';

export class BrowseTags extends React.Component {
  render() {
    return (      
      <div className="bookmark-list">
        <div className="title-1" id="browse-header">Browse Tags</div>
        <TagsList/>
      </div>
    );
  }
}

export default BrowseTags;
