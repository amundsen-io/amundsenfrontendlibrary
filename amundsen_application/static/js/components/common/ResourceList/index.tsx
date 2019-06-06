import * as React from 'react';
import ResourceListItem from 'components/common/ResourceListItem';
import { Resource } from 'components/common/ResourceListItem/types';

export interface ResourceListProps {
  resources: Resource[];
  source: string;
  startIndex: number;
}

const ResourceList: React.SFC<ResourceListProps> = ({ resources, source, startIndex }) => {
  return (
    <ul className="list-group">
      {
        resources.map((resource, idx) => {
          const logging = { source, index: startIndex + idx };
          return <ResourceListItem item={ resource } logging={ logging } key={ idx } />;
        })
      }
    </ul>
  );
};

export default ResourceList;
