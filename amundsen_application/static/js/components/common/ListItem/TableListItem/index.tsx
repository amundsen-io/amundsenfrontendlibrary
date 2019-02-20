import * as React from 'react';
import { Link } from 'react-router-dom';

import { QueryParams, TableData } from '../types';

// import './styles.scss';

interface TableListItemProps {
  data: TableData;
  params: QueryParams;
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
    const { params, data } = this.props;
    return `/table_detail/${data.cluster}/${data.database}/${data.schema_name}/${data.name}`
      + `?index=${params.index}&source=${params.source}`;
  };


  render() {
    const { data } = this.props;
    return (
      <li className="list-group-item search-list-item">
        <Link to={ this.getLink() }>
          <img className="icon icon-color icon-database" />
          <div className="resultInfo">
            <span className="title truncated">{ `${data.schema_name}.${data.name} `}</span>
            <span className="subtitle truncated">{ data.description }</span>
          </div>
          { /*createLastUpdatedTimestamp()*/ }
          <img className="icon icon-right" />
        </Link>
      </li>
    );
  }
}

export default TableListItem;
