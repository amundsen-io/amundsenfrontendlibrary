// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { logClick } from 'ducks/utilMethods';
import { LineageItem } from 'interfaces/TableMetadata';
import BookmarkIcon from 'components/Bookmark/BookmarkIcon';
import { getSourceDisplayName } from 'config/config-utils';
import BadgeList from 'features/BadgeList';
import { ResourceType } from 'interfaces/Resources';

export interface LineageListProps {
  items: LineageItem[];
}

const LineageList: React.FC<LineageListProps> = ({
  items,
}: LineageListProps) => (
  <div className="list-group">
    {items.map((table, index) => {
      const link =
        `/table_detail/${table.cluster}/${table.database}/${table.schema}/${table.name}` +
        `?index=${index}&source=table_lineage_list`;
      const badges = table.badges.map((badgeName) => ({
        badge_name: badgeName,
      }));

      return (
        <li key={index} className="list-group-item clickable">
          <a
            className="resource-list-item"
            href={link}
            target="_blank"
            id=""
            onClick={logClick}
            rel="noreferrer"
          >
            <div className="resource-info">
              <div className="resource-info-text my-auto">
                <div className="resource-name title-2">
                  <div className="truncated">
                    {table.schema}.{table.name}
                  </div>
                  <BookmarkIcon
                    bookmarkKey={table.key}
                    resourceType={ResourceType.table}
                  />
                </div>
              </div>
            </div>
            <div className="resource-type">
              {getSourceDisplayName(table.database, ResourceType.table)}
            </div>
            <div className="resource-badges">
              {!!table.badges && table.badges.length > 0 && (
                <div>
                  <div className="body-secondary-3">
                    <BadgeList badges={badges} />
                  </div>
                </div>
              )}
              <img className="icon icon-right" alt="" />
            </div>
          </a>
        </li>
      );
    })}
  </div>
);
export default LineageList;
