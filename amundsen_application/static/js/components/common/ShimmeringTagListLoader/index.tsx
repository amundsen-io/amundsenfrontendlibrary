import * as React from 'react';
import * as times from 'lodash/times';

import './styles.scss';

const DEFAULT_REPETITION = 10;

type ShimmeringTagItemProps = {
  index: number;
};

export const ShimmeringTagItem: React.SFC<ShimmeringTagItemProps> = ({
  index,
}: ShimmeringTagItemProps) => {
  return (
    <span
      className={`shimmer-tag-loader-item shimmer-tag-loader-item--${index} is-shimmer-animated`}
    />
  );
};

export interface ShimmeringTagListLoaderProps {
  numItems?: number; // Max items would be 15
}

const ShimmeringTagListLoader: React.SFC<ShimmeringTagListLoaderProps> = ({
  numItems = DEFAULT_REPETITION,
}: ShimmeringTagListLoaderProps) => {
  return (
    <div className="shimmer-tag-list-loader">
      {times(numItems, (idx) => (
        <ShimmeringTagItem key={idx} index={idx} />
      ))}
    </div>
  );
};

export default ShimmeringTagListLoader;
