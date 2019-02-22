import * as React from 'react'

import { SearchIndexParams} from './types';
import { SearchResult, SearchResultType, TableSearchResult } from "../../../ducks/search/types";

import TableListItem from './TableListItem';

interface ListItemProps {
  params: SearchIndexParams;
  item: SearchResult;
}


export default class ListItem extends React.Component<ListItemProps, {}> {

  constructor(props) {
    super(props);
  }

  render() {
    switch(this.props.item.type) {
      case SearchResultType.table:
        return (<TableListItem item={ this.props.item as TableSearchResult } params={this.props.params}></TableListItem>);
      // case ListItemType.user:
      // case ListItemType.dashboard:
      // case ListItemType.column:
      default:
        return (null);
    }
  }
}
