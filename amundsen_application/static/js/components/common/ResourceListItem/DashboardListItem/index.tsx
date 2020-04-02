import * as React from 'react';
import * as Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

import { LoggingParams } from '../types';

import BookmarkIcon from 'components/common/Bookmark/BookmarkIcon';

import { toTitleCase } from 'utils/stringUtils';

export interface DashboardListItemProps {
  dashboard: any; // TODO ttannis: Add DashboardResource type when we know what it is
  logging: LoggingParams;
}

class DashboardListItem extends React.Component<DashboardListItemProps, {}> {
  constructor(props) {
    super(props);
  }

  getLink = () => {
    const { dashboard, logging } = this.props;
    // TODO ttannis: Update when we know url
    return `/dashboard`;
  };

  render() {
    const { dashboard } = this.props;

    return (
      <li className="list-group-item clickable">
        <Link className="resource-list-item table-list-item" to={ this.getLink() }>
          <div className="resource-info">
            <img className="icon resource-icon icon-dashboard" />
            <div className="resource-info-text">
              <div className="resource-name title-2">
                <div className="truncated">
                  { // TODO ttannis: Update when we know what this is supposed to be
                    `${dashboard.dashboard_group} - ${dashboard.dashboard_name}`
                  }
                </div>
                <BookmarkIcon bookmarkKey={ 'TODO ttannis: Add bookmarkKey' }/>
              </div>
              <div className="body-secondary-3 truncated">{ dashboard.dashboard_group_description }</div>
            </div>
          </div>
          <div className="resource-type">
            { toTitleCase(dashboard.product) }
          </div>
          <div className="resource-badges">
            <img className="icon icon-right" />
          </div>
        </Link>
      </li>
    );
  }
}

export default DashboardListItem;
