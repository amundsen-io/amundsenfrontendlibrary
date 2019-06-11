import * as React from 'react';
import Pagination from 'react-js-pagination';
import ResourceListItem from 'components/common/ResourceListItem';
import { Resource } from 'components/common/ResourceListItem/types';
import { ITEMS_PER_PAGE, PAGINATION_PAGE_RANGE } from "./constants";


export interface ResourceListProps {
  activePage?: number;
  isFullList: boolean;
  items: Resource[];
  itemsCount?: number;
  itemsPerPage?: number;
  onPagination?: (pageNumber: number) => void;
  source: string;
}

interface ResourceListState {
  activePage: number;
}

class ResourceList extends React.Component<ResourceListProps, ResourceListState> {

  constructor(props) {
    super(props);
    this.state = { activePage: this.props.activePage || 0 };
  }

  componentDidUpdate(prevProps) {
    if (this.props.activePage !== prevProps.activePage) {
      this.setState({ activePage: this.props.activePage });
    }
  }

  onPagination = (activePage: number) => {
    activePage--;
    if (this.props.onPagination !== undefined) {
      this.props.onPagination(activePage);
    } else {
      this.setState({ activePage });
    }
  };


  render() {
    const { isFullList, items, source } = this.props;
    const itemsPerPage = this.props.itemsPerPage || ITEMS_PER_PAGE;
    const itemsCount = this.props.itemsCount || items.length;
    const startIndex = itemsPerPage * this.state.activePage;

    let itemsToRender = items;
    if (isFullList) {
      itemsToRender = items.slice(startIndex, startIndex + itemsPerPage);
    }

    return (
      <>
        <ul className="list-group">
          {
            itemsToRender.map((item, idx) => {
              const logging = { source, index: startIndex + idx };
              return <ResourceListItem item={ item} logging={ logging } key={ idx } />;
            })
          }
        </ul>
        {
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
