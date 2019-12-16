import * as React from 'react';

import { CLEAR_BTN_TEXT } from '../constants';

export interface FilterSectionProps {
  title: string;
  hasValue: boolean;
  onClearFilter: () => void;
};

const FilterSection: React.SFC<FilterSectionProps> = ({ title, hasValue, onClearFilter, children }) => {
  return (
    <div className="search-filter-section">
      <div className="search-filter-section-header">
        <div className="title-2">{ title }</div>
        {
          hasValue &&
          <a onClick={ onClearFilter } className='btn btn-flat-icon'>
            <img className='icon icon-left'/>
            <span>{ CLEAR_BTN_TEXT }</span>
          </a>
        }
      </div>
      { children }
    </div>
  );
};

export default FilterSection;
