// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import ClickableBadge from 'components/common/Badges';
import { getBadgeConfig } from 'config/config-utils';
import { Badge } from 'interfaces/Tags';

export interface BadgeListProps {
  badges: any[]; // TODO replace with new badges later
}

const BadgeList: React.FC<BadgeListProps> = ({ badges }: BadgeListProps) => {
  return (
    <span className="badge-list">
      {badges.map((badge, index) => {
        var name;
        if (badge.tag_name) name = badge.tag_name;
        if (badge.badge_name) name = badge.badge_name;
        const badgeConfig = getBadgeConfig(name);

        return (
          <ClickableBadge
            text={badgeConfig.displayName}
            labelStyle={badgeConfig.style}
            key={`badge-${index}`}
          />
        );
      })}
    </span>
  );
};

export default BadgeList;
