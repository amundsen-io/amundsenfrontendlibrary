import * as React from 'react';

export interface QueryListItemProps {
  key: string;
  text: string;
  url: string;
  name: string;
}

class QueryListItem extends React.Component<QueryListItemProps, {}> {

  render() {
    return (<div />);
  }
}

export default QueryListItem;
