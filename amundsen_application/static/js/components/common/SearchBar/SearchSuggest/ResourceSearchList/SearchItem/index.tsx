import * as React from 'react';
import { Link } from 'react-router-dom';

import { ResourceType } from 'interfaces';

export interface SearchItemProps {
  listItemText: string;
  onItemSelect: (event: Event) => void;
  searchTerm: string;
  resourceType: ResourceType;
}

const SearchItem: React.SFC<SearchItemProps> = ({ listItemText, onItemSelect, searchTerm, resourceType }) => {
  // TODO: Will I need to pass pageIndex or will default be assumed?
  // TODO: Verify if this works after pulling Redux search changes
  return (
    <li className="list-group-item">
      <Link
        className="search-item-link"
        onClick={onItemSelect}
        to={`/search?searchTerm=${searchTerm}&selectedTab=${resourceType}&pageIndex=0`}
      >
        <img className="icon icon-search" />
        <div className="title-2 search-item-info">
          <div className="search-term">{`${searchTerm}\u00a0`}</div>
          <div className="search-item-text">{listItemText}</div>
        </div>
      </Link>
    </li>
  );
};

export default SearchItem;
