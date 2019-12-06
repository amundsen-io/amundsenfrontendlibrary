import * as React from 'react';
import { Badge } from 'interfaces/Tags';
import Flag from 'components/common/Flag';
import AppConfig from 'config/config';

export interface BadgeListProps {
  badges: Badge[];
}

export function getBadgeStyle(badgeName: string): string {
  const style = AppConfig.badges.styleMap[badgeName];
  return style || "default";
}


const BadgeList: React.SFC<BadgeListProps> = ({ badges }) => {

  return (
    <div className="badge-list">
      {
        badges.map((badge, index) => {
          return <Flag text={ badge.tag_name }
                       labelStyle={ getBadgeStyle(badge.tag_name) }
                       key={`badge-${index}`}/>;
        })
      }
    </div>
  );
};

export default BadgeList;
