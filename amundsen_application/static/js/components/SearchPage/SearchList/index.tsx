import * as React from 'react';
import ResourceListItem from 'components/common/ResourceListItem';
import { Resource } from 'components/common/ResourceListItem/types';

export interface SearchListProps {
  results?: Resource[];
  params?: SearchListParams;
}

interface SearchListParams {
  source?: string;
  paginationStartIndex?: number;
}

export const generateListItems = (results: Resource[], params?: SearchListParams) => {
  const { source, paginationStartIndex } = params;
  return results.map((resource, index) => {
    const logging = { source, index: paginationStartIndex + index };
    return <ResourceListItem item={ resource } logging={ logging } key={ index } />;
  });
}

const SearchList: React.SFC<SearchListProps> = ({ results, params }) => {
  return (
    <ul className="list-group">
      {generateListItems(results, params)}
    </ul>
  );
};

SearchList.defaultProps = {
  results: [],
  params: {},
};

export default SearchList;
