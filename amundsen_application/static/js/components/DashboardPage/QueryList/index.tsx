import * as React from 'react';

import "./styles.scss";

interface QueryListProps {
  queries: string[];
}

class QueryList extends React.Component<QueryListProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const queries = this.props.queries;
    if (queries.length === 0) {
      return null;
    }

    return (
      <ul className="query-list list-group">
        {
          queries.map(query =>
            (
              <li className="query-list-item list-group-item">
                <div className="title-2 truncated">
                  { query }
                </div>
              </li>
            )
          )
        }
      </ul>
    )
  }
}

export default QueryList;
