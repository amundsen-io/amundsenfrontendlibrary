import * as React from 'react';
import times from 'lodash/times';

import './styles.scss';

const DEFAULT_REPETITION = 3;

const ShimmeringResourceItem: React.SFC = () => {
  return (
    <div className="shimmer-resource-loader-item media">
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

type ShimmeringResourceLoaderProps = {
  numItems?: number;
};

const ShimmeringResourceLoader: React.SFC<ShimmeringResourceLoaderProps> = ({
  numItems = DEFAULT_REPETITION,
}: ShimmeringResourceLoaderProps) => {
  return (
    <div className="shimmer-resource-loader">
      {times(numItems, (idx) => (
        <ShimmeringResourceItem key={idx} />
      ))}
    </div>
  );
};

export default ShimmeringResourceLoader;
