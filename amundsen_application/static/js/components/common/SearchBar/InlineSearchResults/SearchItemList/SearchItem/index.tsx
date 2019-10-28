import * as React from 'react';

import { ResourceType } from 'interfaces';

export interface SearchItemProps {
  listItemText: string;
  onItemSelect: (resourceType: ResourceType) => void;
  searchTerm: string;
  resourceType: ResourceType;
}

class SearchItem extends React.Component<SearchItemProps, {}> {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    this.props.onItemSelect(this.props.resourceType);
  }

  render = () => {
    return (
      <li className="list-group-item">
        <a
          className="search-item-link"
          onClick={this.onClick}
          target='_blank'
        >
          <img className="icon icon-search" />
          <div className="title-2 search-item-info">
            <div className="search-term">{`${this.props.searchTerm}\u00a0`}</div>
            <div className="search-item-text">{this.props.listItemText}</div>
          </div>
        </a>
      </li>
    );
  }
};

export default SearchItem;
