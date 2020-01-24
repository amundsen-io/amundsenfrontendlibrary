import * as React from 'react';
import { connect } from 'react-redux';

import { clearFilterByCategory } from 'ducks/search/filters/reducer';

import { CLEAR_BTN_TEXT } from '../constants';

import InfoButton from 'components/common/InfoButton';

export interface OwnProps {
  categoryId: string;
  hasValue: boolean;
  helpText?: string;
  title: string;
};

export interface DispatchFromProps {
  onClearFilter: () => void;
};

export type FilterSectionProps = OwnProps & DispatchFromProps

export class FilterSection extends React.Component<FilterSectionProps> {
  constructor(props) {
    super(props);
  }

  render = () => {
    const { title, hasValue, helpText, onClearFilter, children } = this.props;
    return (
      <div className="search-filter-section">
        <div className="search-filter-section-header">
          <div className="search-filter-section-title">
            <div className="title-2">{ title }</div>
            {
              helpText &&
              <InfoButton
                infoText={ helpText }
                placement="top"
                size="small"
              />
            }
          </div>
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
  }
};

export const mapDispatchToProps = (dispatch: any, ownProps: OwnProps) => {
  return {
    onClearFilter: () => {
      dispatch(clearFilterByCategory(ownProps.categoryId));
    },
  };
};

export default connect<{}, DispatchFromProps, OwnProps>(null, mapDispatchToProps)(FilterSection);
