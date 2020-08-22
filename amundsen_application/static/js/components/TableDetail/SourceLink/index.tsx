// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { ResourceType } from '../../../interfaces';

import {
  getDescriptionSourceDisplayName,
  getDescriptionSourceIconPath,
} from 'config/config-utils';
import { logClick } from 'ducks/utilMethods';
import AvatarLabel from 'components/common/AvatarLabel';
import { TableSource } from 'interfaces';

export interface SourceLinkProps {
  tableSource: TableSource;
}

const SourceLink: React.FC<SourceLinkProps> = ({
  tableSource,
}: SourceLinkProps) => {
  if (tableSource === null || tableSource.source === null) return null;

  const image = getDescriptionSourceIconPath(
    tableSource.source_type,
    ResourceType.table
  );

  const displayName = getDescriptionSourceDisplayName(
    tableSource.source_type,
    ResourceType.table
  );

  return (
    <a
      className="header-link"
      href={tableSource.source}
      id="explore-source"
      onClick={logClick}
      target="_blank"
      rel="noreferrer"
    >
      <AvatarLabel label={displayName} src={image} />
    </a>
  );
};

export default SourceLink;
