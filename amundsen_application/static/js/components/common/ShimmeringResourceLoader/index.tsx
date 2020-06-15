import * as React from 'react';

import './styles.scss';

const ShimmeringResourceLoader: React.FC = () => {
  return (
    <div className="shimmer-resource-loader-row media">
      <div className="media-left media-middle">
        <div className="shimmer-resource-circle is-shimmer-animated" />
      </div>
      <div className="media-body">
        <div className="shimmer-resource-line shimmer-resource-line--1 is-shimmer-animated" />
        <div className="shimmer-resource-line shimmer-resource-line--2 is-shimmer-animated" />
      </div>
    </div>
  );
};

export default ShimmeringResourceLoader;
