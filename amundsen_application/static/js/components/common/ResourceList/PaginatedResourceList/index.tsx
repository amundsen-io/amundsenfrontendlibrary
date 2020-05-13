import * as React from 'react';
import Pagination from 'react-js-pagination';
import ResourceListItem from 'components/common/ResourceListItem';
import { Resource } from 'interfaces';
import * as Constants from '../constants';

import '../styles.scss';

export interface PaginatedResourceListProps {
  allItems: Resource[];
  emptyText?: string;
  itemsPerPage: number;
  source: string;
}

interface PaginatedResourceListState {
  activePage: number;
}

class PaginatedResourceList extends React.Component<PaginatedResourceListProps, PaginatedResourceListState> {
  public static defaultProps: Partial<PaginatedResourceListProps> = {
    emptyText: Constants.DEFAULT_EMPTY_TEXT,
  };

  constructor(props) {
    super(props);
    this.state = {
      activePage: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const currentPage = this.state.activePage;
    if (this.props.itemsPerPage * currentPage >= this.props.allItems.length) {
      this.setState({ activePage: currentPage - 1 });
    }
  }

  onPagination = (rawPageNum: number) => {
    const activePage = rawPageNum - 1;
    this.setState({ activePage });
  };

  render() {
    const { allItems, emptyText, itemsPerPage, source } = this.props;
    const activePage = this.state.activePage;
    const allItemsCount = allItems.length;

    const startIndex = itemsPerPage * activePage;
    const itemsToRender = this.props.allItems.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="resource-list">
        {
          allItemsCount === 0 && emptyText &&
          <div className="empty-message body-placeholder">
            { emptyText }
          </div>
        }
        {
          allItemsCount > 0 &&
          <>
            <ul className="list-group">
              {
                itemsToRender.map((item, idx) => {
                  const logging = { source, index: startIndex + idx };
                  return <ResourceListItem item={ item } logging={ logging } key={ idx } />;
                })
              }
            </ul>
            {
              allItemsCount > itemsPerPage &&
              <Pagination
                activePage={ activePage + 1 }
                itemsCountPerPage={ itemsPerPage }
                totalItemsCount={ allItemsCount }
                pageRangeDisplayed={ Constants.PAGINATION_PAGE_RANGE }
                onChange={ this.onPagination }
              />
            }
          </>
        }
        <div className="resource-list-footer" />
      </div>
    );
  }
}

export default PaginatedResourceList;
