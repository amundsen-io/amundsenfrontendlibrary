import * as React from 'react';
import ListItem from '../../common/ListItem';
import { SearchListResult } from '../../../ducks/search/types';
import { ListItemType } from "../../common/ListItem/types";

interface SearchListProps {
  results?: SearchListResult[];
  params?: SearchListParams;
}

interface SearchListParams {
  source?: string;
  paginationStartIndex?: number;
}

const SearchList: React.SFC<SearchListProps> = ({ results, params }) => {
  const { source , paginationStartIndex } = params;
  const resultMap = results.map((entry, i) => {
    return (
      <ListItem
        data={entry}
        params={{source, index: paginationStartIndex + i}}></ListItem>
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


    /**

    <SearchListItem
      key={ entry.key }
      params={{source, index: paginationStartIndex + i}}
      title={`${entry.schema_name}.${entry.name}`}
      subtitle={ entry.description }
      lastUpdated = { entry.last_updated }
      schema={ entry.schema_name }
      cluster={ entry.cluster }
      table={ entry.name }
      db={ entry.database }
  />

  */
