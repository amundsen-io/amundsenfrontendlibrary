import * as React from 'react';
import Pagination from 'react-js-pagination';
import ResourceListItem from 'components/common/ResourceListItem';
import { Resource } from 'interfaces';
import { ITEMS_PER_PAGE, PAGINATION_PAGE_RANGE } from './constants';


export interface ResourceListProps {
  items: Resource[];
  source: string;

  paginate?: boolean;
  // The following props are only used if 'paginate' is set to true
  // TODO - consider nesting these into a 'paginateOptions' field
  activePage?: number;
  isFullList?: boolean;
  itemsCount?: number;
  itemsPerPage?: number;
  onPagination?: (pageNumber: number) => void;
}

interface ResourceListState {
  activePage: number;
}

class ResourceList extends React.Component<ResourceListProps, ResourceListState> {
  public static defaultProps: Partial<ResourceListProps> = {
    paginate: false,
    activePage: 0,
    itemsPerPage: ITEMS_PER_PAGE,
    isFullList: true,
  };

  constructor(props) {
    super(props);
    this.state = { activePage: this.props.activePage };
  }

  componentDidUpdate(prevProps) {
    if (this.props.activePage !== prevProps.activePage) {
      this.setState({ activePage: this.props.activePage });
    }
  }

  onPagination = (rawPageNum: number) => {
    const activePage = rawPageNum - 1;
    if (this.props.onPagination !== undefined) {
      this.props.onPagination(activePage);
    } else {
      this.setState({ activePage });
    }
  };


  render() {
    const { isFullList, items, itemsPerPage, paginate, source } = this.props;
    const itemsCount = this.props.itemsCount || items.length;
    const startIndex = itemsPerPage * this.state.activePage;

    let itemsToRender = items;
    if (paginate && isFullList) {
      itemsToRender = items.slice(startIndex, startIndex + itemsPerPage);
    }

    return (
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
          paginate &&
          itemsCount > itemsPerPage &&
          <div className="text-center">
            <Pagination
              activePage={ this.state.activePage + 1 }
              itemsCountPerPage={ itemsPerPage }
              totalItemsCount={ itemsCount }
              pageRangeDisplayed={ PAGINATION_PAGE_RANGE }
              onChange={ this.onPagination }
            />
          </div>
        }
      </>
    );
  }
}

export default ResourceList;
