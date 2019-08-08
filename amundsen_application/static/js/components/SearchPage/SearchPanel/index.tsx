import * as React from 'react';

import { ResourceType } from 'interfaces/Resources';
import ResourceSelector from 'components/SearchPage/ResourceSelector';


import './styles.scss';

export interface SearchPanelProps {
  onChange: (tab: ResourceType) => void;
}

export default class SearchPanel extends React.Component<SearchPanelProps> {

  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div className="search-control-panel">
        <ResourceSelector onChange={ this.props.onChange } />
      </div>
    );
  }
};
