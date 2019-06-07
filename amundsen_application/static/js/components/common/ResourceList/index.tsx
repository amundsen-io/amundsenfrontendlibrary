import * as React from 'react';
import Pagination from 'react-js-pagination';
import ResourceListItem from 'components/common/ResourceListItem';
import { Resource } from 'components/common/ResourceListItem/types';
import { ITEMS_PER_PAGE, PAGINATION_PAGE_RANGE } from "./constants";


export interface ResourceListProps {
  activePage: number;
  isFullList: boolean;
  items: Resource[];
  itemsCount?: number;
  itemsPerPage?: number;
  onPagination: (pageNumber: number) => void;
  source: string;
}

const ResourceList: React.SFC<ResourceListProps> = ({
                                                      activePage,
                                                      isFullList,
                                                      items,
                                                      itemsCount,
                                                      itemsPerPage,
                                                      onPagination,
                                                      source,
                                                    }) => {

  itemsPerPage = itemsPerPage || ITEMS_PER_PAGE;
  itemsCount = itemsCount || items.length;

  const startIndex = itemsPerPage * activePage;

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
            activePage={ activePage + 1 }
            itemsCountPerPage={ itemsPerPage }
            totalItemsCount={ itemsCount }
            pageRangeDisplayed={ PAGINATION_PAGE_RANGE }
            onChange={ onPagination }
          />
        </div>
      }
    </>
  );
};

export default ResourceList;
