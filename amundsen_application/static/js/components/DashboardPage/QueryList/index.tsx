import * as React from 'react';
import QueryListItem from '../QueryListItem';

import { QueryResource } from 'interfaces';

import "./styles.scss";


export interface QueryListProps {
  queries: QueryResource[];
}

class QueryList extends React.Component<QueryListProps> {

  render() {
    const { queries } = this.props;

    if (queries.length === 0) {
      return null;
    }

    const queryList = queries.map((query) => (
      <QueryListItem
        key={`query:${query.name}`}
        text={query.query_text}
        url={query.url}
        name={query.name}
      />
    ));

    return (
      <ul className="query-list list-group">
        { queryList }
      </ul>
    );
  }
}

export default QueryList;
