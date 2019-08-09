import * as React from 'react';
import * as Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

import { LoggingParams } from '../types';

import { UserResource } from 'interfaces';
import Flag from 'components/common/Flag';

export interface UserListItemProps {
  user: UserResource;
  logging: LoggingParams;
}

class UserListItem extends React.Component<UserListItemProps, {}> {
  constructor(props) {
    super(props);
  }

  getLink = () => {
    const { user, logging } = this.props;
    return `/user/${user.user_id}?index=${logging.index}&source=${logging.source}`;
  };

  render() {
    const { user } = this.props;
    return (
      <li className="list-group-item">
        <Link className="resource-list-item user-list-item" to={ this.getLink() }>
          <div className="resource-info">
            <Avatar name={ user.display_name } size={ 24 } round={ true } />
            <div className="truncated">
              <div className="resource-name title-2">
                { user.display_name }
              </div>
              <div className="body-secondary-3">
                {
                  !user.role_name && user.team_name &&
                  `${user.team_name}`
                }
                {
                  user.role_name && user.team_name &&
                  `${user.role_name} on ${user.team_name}`
                }
              </div>
            </div>
          </div>
          <div className="resource-type">
            User
          </div>
          <div className="resource-badges">
            {
              !user.is_active &&
              <Flag text="Alumni" labelStyle='danger' />
            }
            <img className="icon icon-right end-icon" />
          </div>
        </Link>
      </li>
    );
  }
}

export default UserListItem;
