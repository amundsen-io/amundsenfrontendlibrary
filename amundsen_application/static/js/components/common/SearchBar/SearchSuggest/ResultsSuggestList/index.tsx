import * as React from 'react';
import { Link } from 'react-router-dom';

import { ResourceType } from 'interfaces';

import { SuggestedResult } from '../../SearchSuggest'
import ResultItem from './ResultItem';

export interface ResultsSuggestListProps {
  onItemSelect: (event: Event) => void;
  resourceType: string;
  searchTerm: string;
  suggestedResults: SuggestedResult[];
  title: string;
  totalResults: number;
}

class ResultsSuggestList extends React.Component<ResultsSuggestListProps, {}> {
  constructor(props) {
    super(props);
  }

  renderResultItems = (results: SuggestedResult[]) => {
    return results.map((item, index) => {
      const { href, iconClass, subtitle, title, type } = item;
      return (
        <ResultItem
          key={`${this.props.resourceType}:${index}`}
          href={href}
          onItemSelect={this.props.onItemSelect}
          iconClass={`icon ${iconClass}`}
          subtitle={subtitle}
          title={title}
          type={type}
        />
      )
    });
  }

  render = () => {
    const { onItemSelect, resourceType, searchTerm, suggestedResults, totalResults, title } = this.props;
    return (
      <>
        <div className="section-title title-3">{title}</div>
        <ul className="list-group">
          { this.renderResultItems(suggestedResults) }
        </ul>
        <Link
          className="section-footer title-3"
          onClick={onItemSelect}
          to={`/search?searchTerm=${searchTerm}&selectedTab=${resourceType}&pageIndex=0`}
        >
          {/* TODO: Will I need to pass pageIndex or will default be assumed?
              TODO: Verify if this works after pulling Redux search changes*/}
          {`See all ${totalResults} ${title} results`}
        </Link>
      </>
    );
  }
}

export default ResultsSuggestList;
