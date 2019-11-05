import * as React from 'react';
import { Link } from 'react-router-dom';

export interface ResultItemProps {
  href: string
  iconClass: string;
  onItemSelect: () => void;
  subtitle: string;
  title: string;
  type: string;
}

const ResultItem: React.SFC<ResultItemProps> = ({ href, iconClass, onItemSelect, subtitle, title, type }) => {
  return (
    <li className="list-group-item">
      <Link className="result-item-link" onClick={onItemSelect} to={ href }>
        <img className={`result-icon ${iconClass}`} />

        <div className="result-info">
          <div className="truncated">
            <div className="title-2 truncated">{ title }</div>
            <div className="body-secondary-3 truncated">{ subtitle }</div>
          </div>
        </div>

        <div className="resource-type">{ type }</div>
      </Link>
    </li>
  );
};

export default ResultItem;
