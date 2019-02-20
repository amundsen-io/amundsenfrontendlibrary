import * as React from 'react'

import { ListItemType, TableListItemData } from './types';
import TableListItem from './TableListItem';


type ListItemProps = TableListItemData;


export default class ListItem extends React.Component<ListItemProps, {}> {

  constructor(props) {
    super(props);
  }

  render() {
    switch(this.props.type) {
      case ListItemType.table:
        return (<TableListItem data={ this.props.data } params={this.props.params}></TableListItem>);
      // case ListItemType.person:
      // case ListItemType.dashboard:
      // case ListItemType.column:
      default:
        return (null);
    }
  }
}
