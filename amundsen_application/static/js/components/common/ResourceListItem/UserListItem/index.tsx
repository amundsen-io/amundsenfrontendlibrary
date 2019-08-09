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
          <Avatar name={ user.display_name } size={ 24 } round={ true } />
          <div className="content">
            <div className="resource-name title-2">
              <div className="">
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
            <div className="resource-type hidden-xs col-sm-3 col-md-2">
              User
            </div>
            {
              !user.is_active &&
              <div className="resource-badges hidden-xs col-sm-3 col-md-2">
                <Flag text="Alumni" labelStyle='danger' />
              </div>
            }
          </div>
          <img className="icon icon-right end-icon" />
        </Link>
      </li>
    );
  }
}

export default UserListItem;
