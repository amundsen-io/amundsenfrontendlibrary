import * as React from 'react';
import { Link } from 'react-router-dom';

import { SearchIndexParams } from '../types';
import { TableSearchResult } from "../../../../ducks/search/types";

import './styles.scss';

interface TableListItemProps {
  item: TableSearchResult;
  params: SearchIndexParams;
}

class TableListItem extends React.Component<TableListItemProps, {}> {

  constructor(props) {
    super(props);
  }


  /* TODO: We have to fix a bug with this feature. Commented out support.
  const createLastUpdatedTimestamp = () => {
    if (lastUpdated) {
      const dateTokens = new Date(lastUpdated).toDateString().split(' ');
      return (
        <label>
          {`${dateTokens[1].toUpperCase()} ${dateTokens[2]}`}
        </label>
      )
    }
    return null;
  }*/

  getLink = () => {
    const { item, params } = this.props;
    return `/table_detail/${item.cluster}/${item.database}/${item.schema_name}/${item.name}`
      + `?index=${params.index}&source=${params.source}`;
  };


  render() {
    const { item } = this.props;
    return (
      <li className="list-group-item search-list-item">
        <Link to={ this.getLink() }>
          <img className="icon icon-color icon-database" />
          <div className="resultInfo">
            <span className="title truncated">{ `${item.schema_name}.${item.name} `}</span>
            <span className="subtitle truncated">{ item.description }</span>
          </div>
          { /*createLastUpdatedTimestamp()*/ }
          <img className="icon icon-right" />
        </Link>
      </li>
    );
  }
}

export default TableListItem;
