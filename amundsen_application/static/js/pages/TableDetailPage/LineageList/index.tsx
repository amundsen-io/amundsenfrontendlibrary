// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { logClick } from 'ducks/utilMethods';
import { Lineage, LineageItem } from 'interfaces/TableMetadata';

export interface LineageListProps {
  items: LineageItem[];
}

const LineageList: React.FC<LineageListProps> = ({
  items,
}: LineageListProps) => (
  <div className="list-group">
    {items.map((item, index) => (
      <li key={index} className="list-group-item clickable">
        {item.key}
      </li>
    ))}
  </div>

  // <a
  //   className="header-link"
  //   href={href}
  //   target="_blank"
  //   id="explore-lineage"
  //   onClick={logClick}
  //   rel="noreferrer"
  // >
  // </a>
);
export default LineageList;
