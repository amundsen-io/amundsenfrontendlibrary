import * as React from 'react';
import { Link } from 'react-router-dom';

import { LoggingParams, TableResource} from '../types';
import Bookmark from '../../Bookmark';

interface TableListItemProps {
  table: TableResource;
  logging: LoggingParams;
}

class TableListItem extends React.Component<TableListItemProps, {}> {
  constructor(props) {
    super(props);
  }

  getLink = () => {
    const { table, logging } = this.props;
    return `/table_detail/${table.cluster}/${table.database}/${table.schema_name}/${table.name}`
      + `?index=${logging.index}&source=${logging.source}`;
  };

  render() {
    const { table } = this.props;

    const hasLastUpdated = table.last_updated_epoch !== 0 && table.last_updated_epoch !== null;
    const dateTokens = new Date(table.last_updated_epoch * 1000).toDateString().split(' ');
    const dateLabel = `${dateTokens[1]} ${dateTokens[2]}, ${dateTokens[3]}`;

    return (
      <li className="list-group-item">
        <Link className="resource-list-item table-list-item" to={ this.getLink() }>
          <img className="icon icon-database icon-color " />
          <div className="content">
            <div className="col-xs-12 col-sm-6">
              <div className="main-title">
                <span className="truncated">
                  { `${table.schema_name}.${table.name}`}
                </span>
                <Bookmark />
              </div>
              <div className="description truncated">{ table.description }</div>
            </div>
            <div className={ hasLastUpdated? "hidden-xs col-sm-3 col-md-4" : "hidden-xs col-sm-6"}>
              <div className="secondary-title">Frequent Users</div>
              {/* TODO - Replace with a link to a real user */}
              <div className="description truncated">
                <label>Ash Ketchum, Gary Oak</label>
              </div>
            </div>
            {
              hasLastUpdated &&
              <div className="hidden-xs col-sm-3 col-md-2">
                <div className="secondary-title">Latest Data</div>
                <div className="description truncated">
                  { dateLabel }
                </div>
              </div>
            }
          </div>
          <img className="icon icon-right" />
        </Link>
      </li>
    );
  }
}

export default TableListItem;
