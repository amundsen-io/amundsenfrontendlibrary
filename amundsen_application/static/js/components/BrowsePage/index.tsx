import * as React from 'react';
import * as DocumentTitle from 'react-document-title';

import BrowseTags from 'components/BrowseTags';

export class BrowsePage extends React.Component {
  render() {
    return (
      <DocumentTitle title="Browse - Amundsen">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <BrowseTags />
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default BrowsePage;
