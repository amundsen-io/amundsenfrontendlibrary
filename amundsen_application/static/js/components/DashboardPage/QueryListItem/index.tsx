import * as React from 'react';
import { CopyBlock, atomOneLight } from 'react-code-blocks';

import './styles.scss';

export interface QueryListItemProps {
  key: string;
  text: string;
  url: string;
  name: string;
}

type GoToDashboardLinkProps = {
  url: string;
}

const QUERY_LABEL = "Query";
const LANGUAGE = "sql";

const GoToDashboardLink = ({ url }: GoToDashboardLinkProps) => {
  return (
    <a className="query-list-query-link" href={url} target="_blank" rel="noopener noreferrer">
      <svg className="icon" fill="none" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 3v2.75H5.75v12.5h12.5V15H21v6H3V3h6zm12 0v9.75h-2.75V7.892L10.544 15.6 8.4 13.456l7.707-7.707-4.607.001V3H21z"
        />
      </svg>
    </a>
  );
};

const QueryListItem = ({ name, text, key, url }: QueryListItemProps) => {
  const [isExpanded, setExpanded] = React.useState(false);
  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  return (
    <li className="list-group-item query-list-item clickable" key={key} role="tab" id={key}>
      <a className="query-list-header" aria-expanded={isExpanded} aria-controls={key} role="button" href="#" onClick={toggleExpand}>
        <p className="query-list-item-name column-name">{ name }</p>
      </a>
      {
        isExpanded &&
        <div className="query-list-expanded-content">
          <label className="query-list-query-label section-title">{QUERY_LABEL}:
            <div className="query-list-query-content">
              <GoToDashboardLink url={url} />
              <CopyBlock
                text={text}
                language={LANGUAGE}
                theme={atomOneLight}
                showLineNumbers={false}
                wrapLines={true}
                codeBlock={true}
              />
            </div>
          </label>
        </div>
      }
    </li>
  );
}

export default QueryListItem;
