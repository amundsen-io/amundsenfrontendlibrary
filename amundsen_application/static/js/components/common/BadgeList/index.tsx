import * as React from 'react';
import { Badge } from 'interfaces/Tags';
import Flag from 'components/common/Flag';
import AppConfig from 'config/config';
import { BadgeConfig, BadgeStyle } from 'config/config-types';

export interface BadgeListProps {
  badges: Badge[];
}

export function getBadgeConfig(badgeName: string): BadgeConfig {
  const config = AppConfig.badges[badgeName];
  return config ? config :  {
    style: BadgeStyle.DEFAULT,
    displayName: badgeName,
  };
}


const BadgeList: React.SFC<BadgeListProps> = ({ badges }) => {

  return (
    <div className="badge-list">
      {
        badges.map((badge, index) => {
          const badgeConfig = getBadgeConfig(badge.tag_name);

          return <Flag text={ badgeConfig.displayName }
                       labelStyle={ badgeConfig.style }
                       key={`badge-${index}`}/>;
        })
      }
    </div>
  );
};

export default BadgeList;
