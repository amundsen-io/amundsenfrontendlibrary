import * as React from 'react';

import './styles.scss';

export interface QueryListItemProps {
  key: string;
  text: string;
  url: string;
  name: string;
}

const QUERY_LABEL = "Query";

const QueryListItem = ({ name, text, key, url }: QueryListItemProps) => {
  const [isExpanded, setExpanded] = React.useState(false);
  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  return (
    <li className="list-group-item query-list-item clickable" onClick={toggleExpand} key={key}>
      <div className="query-list-header">
        <p className="query-list-item-name column-name">{ name }</p>
      </div>
      {
        isExpanded &&
        <div className="query-list-expanded-content">
          <label className="query-list-query-label section-title" htmlFor="query">{QUERY_LABEL}:</label>
          <div className="query-list-query-content">{text}</div>
          <a href={url}>See Dashboard</a>
        </div>
      }
    </li>
  );
}

export default QueryListItem;
