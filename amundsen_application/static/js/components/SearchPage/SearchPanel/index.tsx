import * as React from 'react';

import './styles.scss';

export interface SearchPanelProps {
  resourceChild: React.ReactNode;
  // TODO: Required when we have filtering
  filterChild?: React.ReactNode;
}

const SearchPanel: React.SFC<SearchPanelProps> = ({ resourceChild, filterChild }) => {
  return (
    <div className="search-control-panel">
      <div className="section">
        { resourceChild }
      </div>
      { // TODO: Remove conditional rendering when we have filtering
        filterChild &&
        <div className="section">
          { filterChild }
        </div>
      }
    </div>
  );
};

export default SearchPanel;
