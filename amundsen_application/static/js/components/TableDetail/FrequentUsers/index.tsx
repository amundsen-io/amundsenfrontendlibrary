import * as React from 'react';
import * as Avatar from 'react-avatar';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { TableReader } from 'interfaces';
import AppConfig from 'config/config';
import { logClick } from 'ducks/utilMethods';

export interface FrequentUsersProps {
  readers: TableReader[];
}

const FrequentUsers: React.SFC<FrequentUsersProps> = ({ readers }) => {
  if (readers.length === 0) {
    return (<label className="m-auto">No frequent users exist</label>);
  }

  return (
    <div>
      {
        readers.map((entry, index) => {
          const user = entry.reader;
          const popoverHoverFocus = (
            <Popover id="popover-trigger-hover-focus">
              {user.display_name}
            </Popover>
          );

          let link = user.profile_url;
          let target = '_blank';
          if (AppConfig.indexUsers.enabled) {
            link = `/user/${user.user_id}?source=frequent_users`;
            target = '';
          }

          return (
            <OverlayTrigger key={user.display_name} trigger={['hover', 'focus']} placement="top"
                            overlay={popoverHoverFocus}>
              <Link
                to={link}
                target={target}
                className="avatar-overlap"
                id="frequent-users"
                onClick={ logClick }
              >
                <Avatar name={user.display_name} size={25} round={true} style={{ zIndex: readers.length - index, position: 'relative' }}/>
              </Link>
            </OverlayTrigger>
          );
        })
      }
    </div>
  )
};

export default FrequentUsers;
