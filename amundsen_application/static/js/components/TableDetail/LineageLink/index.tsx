import * as React from 'react';

import { logClick } from 'ducks/utilMethods';

import AvatarLabel from 'components/common/AvatarLabel';
import AppConfig from 'config/config';

export interface LineageLinkProps {
  cluster: string;
  database: string;
  schema: string;
  tableName: string;
}

const LineageLink: React.SFC<LineageLinkProps> = ({ cluster, database, schema, tableName }) => {
  const config = AppConfig.tableLineage;
  if (!config.isEnabled) return null;
  const href = config.urlGenerator(database, cluster, schema, tableName);
  const label = 'Lineage' + (config.isBeta ? ' (beta)' : '');
  return (
    <a
      href={ href }
      target="_blank"
      id="explore-lineage"
      onClick={ logClick }>
      <AvatarLabel
        label={ label }
        src={ config.iconPath }
      />
    </a>
  );
};

export default LineageLink;
