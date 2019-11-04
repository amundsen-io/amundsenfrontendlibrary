import * as React from 'react';

import { ResourceType } from 'interfaces';

import { SuggestedResult } from '../../InlineSearchResults'
import ResultItem from './ResultItem';

export interface ResultItemListProps {
  viewAllResults: (resourceType: ResourceType) => void;
  onItemSelect: () => void;
  resourceType: ResourceType;
  searchTerm: string;
  suggestedResults: SuggestedResult[];
  title: string;
  totalResults: number;
}

class ResultItemList extends React.Component<ResultItemListProps, {}> {
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
          iconClass={`icon icon-dark ${iconClass}`}
          subtitle={subtitle}
          title={title}
          type={type}
        />
      )
    });
  }

  onClick = () => {
    this.props.viewAllResults(this.props.resourceType);
  };

  render = () => {
    const { onItemSelect, resourceType, searchTerm, suggestedResults, totalResults, title } = this.props;
    return (
      <>
        <div className="section-title title-3">{title}</div>
        <ul className="list-group">
          { this.renderResultItems(suggestedResults) }
        </ul>
        <a
          className="section-footer title-3"
          onClick={this.onClick}
          target='_blank'
        >
          {`See all ${totalResults} ${title} results`}
        </a>
      </>
    );
  }
}

export default ResultItemList;
