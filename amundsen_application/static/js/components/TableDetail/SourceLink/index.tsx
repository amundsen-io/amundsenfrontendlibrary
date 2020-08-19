// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import AppConfig from 'config/config';
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

  const config = AppConfig.tableSource;

  const image = config[tableSource.source_type]
    ? config[tableSource.source_type].iconPath
    : '';

  const displayName = config[tableSource.source_type]
    ? config[tableSource.source_type].displayName
    : tableSource.source_type;

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
