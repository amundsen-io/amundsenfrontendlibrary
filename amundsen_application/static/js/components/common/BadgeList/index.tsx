// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import ClickableBadge from 'components/common/Badges';
import Flag, { CaseType } from 'components/common/Flag';
import { getBadgeConfig, convertText } from 'config/config-utils';
import { Badge } from 'interfaces/Badges';
import { BadgeStyle, BadgeStyleConfig } from 'config/config-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import Flag, { FlagProps, convertText, CaseType } from 'components/common/Flag';
import { ResourceType } from 'interfaces';
import { updateSearchState } from 'ducks/search/reducer';
import { UpdateSearchStateRequest } from 'ducks/search/types';
import { logClick } from 'ducks/utilMethods';
import './styles.scss';

const COLUMN_BADGE_CATEGORY = 'column';

export interface ListProps {
  badges: Badge[];
}

export interface DispatchFromProps {
  searchBadge: (badgeText: string) => UpdateSearchStateRequest;
}

export interface ActionableBadgeProps {
  style: BadgeStyle,
  displayName: string,
  action: any;
}

export type BadgeListProps = ListProps & DispatchFromProps;


const StaticBadge: React.FC<BadgeStyleConfig> = ({ style, displayName }: BadgeStyleConfig) => {
  return (
    <span className={`static-badge flag label label-${style}`}>
      <div className={`badge-overlay-${style}`}>
        {displayName}
      </div>
    </span>);
};

const ActionableBadge: React.FC<ActionableBadgeProps> = ({ style, displayName, action }: ActionableBadgeProps) => {
  return (
    <span className="actionable-badge" onClick={action}>
      <StaticBadge
        style={style}
        displayName={displayName}
      />
    </span >
  );
};

export class BadgeList extends React.Component<BadgeListProps> {
  render() {
    return (
      <span className="badge-list">
        {this.props.badges.map((badge, index) => {
          let badgeConfig;
          let originalBadgeName;
          // search badges with just name
          if (badge.tag_name) {
            originalBadgeName = badge.tag_name;
            badgeConfig = getBadgeConfig(badge.tag_name);
          }
          // metadata badges with name and category
          else if (badge.badge_name) {
            originalBadgeName = badge.badge_name;
            badgeConfig = getBadgeConfig(badge.badge_name);
            if (badge.category === COLUMN_BADGE_CATEGORY) {
              return (<StaticBadge
                style={badgeConfig.style}
                displayName={badgeConfig.displayName}
                key={`badge-${index}`}
              />);
            }
          }
          if (badge.category !== COLUMN_BADGE_CATEGORY) {
            let onClick = (e) => {
              const badgeText = originalBadgeName;
              logClick(e, {
                target_type: 'badge',
                label: badgeText,
              });
              this.props.searchBadge(convertText(badgeText, CaseType.LOWER_CASE));
            };
            return (<ActionableBadge
              displayName={badgeConfig.displayName}
              style={badgeConfig.style}
              action={onClick}
              key={`badge-${index}`}
            />);
          }

        }
        )}
      </span>);
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      searchBadge: (badgeText: string) =>
        updateSearchState({
          filters: {
            [ResourceType.table]: { badges: badgeText },
          },
          submitSearch: true,
        }),
    },
    dispatch
  );
};

export default connect<null, DispatchFromProps, ListProps>(
  null,
  mapDispatchToProps
)(BadgeList);
