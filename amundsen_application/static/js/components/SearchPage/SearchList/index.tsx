import * as React from 'react';
import ListItem from '../../common/ListItem';
import { SearchResult } from '../../../ducks/search/types';


interface SearchListProps {
  results?: SearchResult[];
  params?: SearchListParams;
}

interface SearchListParams {
  source?: string;
  paginationStartIndex?: number;
}

const SearchList: React.SFC<SearchListProps> = ({ results, params }) => {
  const { source , paginationStartIndex } = params;
  const resultMap = results.map((result, i) => {
    return (
      <ListItem
        item={ result }
        params={{source, index: paginationStartIndex + i}} />
    );
  });
  return (
    <ul className="list-group">
      { resultMap }
    </ul>
  );
};

SearchList.defaultProps = {
  results: [],
  params: {},
};

export default SearchList;
