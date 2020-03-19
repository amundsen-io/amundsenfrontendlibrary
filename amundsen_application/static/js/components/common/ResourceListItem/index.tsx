import * as React from 'react'

import { Resource, ResourceType, TableResource, UserResource } from 'interfaces';

import { LoggingParams } from './types';
import DashboardListItem from './DashboardListItem';
import TableListItem from './TableListItem';
import UserListItem from './UserListItem';

import './styles.scss';

export interface ListItemProps {
  logging: LoggingParams;
  item: Resource;
}

export default class ResourceListItem extends React.Component<ListItemProps> {
  constructor(props) {
    super(props);
  }

  render() {
    switch(this.props.item.type) {
      // TODO ttannis: Add DashboardResource type when we know what it is
      case ResourceType.dashboard:
        return (<DashboardListItem dashboard={ this.props.item as any } logging={ this.props.logging } />);
      case ResourceType.table:
        return (<TableListItem table={ this.props.item as TableResource } logging={ this.props.logging } />);
      case ResourceType.user:
        return (<UserListItem user={ this.props.item as UserResource } logging={ this.props.logging } />);
      default:
        return (null);
    }
  }
}
