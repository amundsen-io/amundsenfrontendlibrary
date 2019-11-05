import * as React from 'react';

import { ResourceType } from 'interfaces';

import { SuggestedResult } from '../../InlineSearchResults'
import ResultItem from './ResultItem';

export interface ResultItemListProps {
  onItemSelect: (resourceType: ResourceType, updateUrl?: boolean) => void;
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
    const onResultItemSelect = () => this.props.onItemSelect(this.props.resourceType);

    return results.map((item, index) => {
      const { href, iconClass, subtitle, title, type } = item;
      return (
        <ResultItem
          key={`${this.props.resourceType}:${index}`}
          href={href}
          onItemSelect={onResultItemSelect}
          iconClass={`icon icon-dark ${iconClass}`}
          subtitle={subtitle}
          title={title}
          type={type}
        />
      )
    });
  }

  onViewAllResults = () => {
    this.props.onItemSelect(this.props.resourceType, true);
  };

  render = () => {
    const { suggestedResults, totalResults, title } = this.props;
    return (
      <>
        <div className="section-title title-3">{title}</div>
        <ul className="list-group">
          { this.renderResultItems(suggestedResults) }
        </ul>
        <a
          className="section-footer title-3"
          onClick={this.onViewAllResults}
          target='_blank'
        >
          {`See all ${totalResults} ${title} results`}
        </a>
      </>
    );
  }
}

export default ResultItemList;
