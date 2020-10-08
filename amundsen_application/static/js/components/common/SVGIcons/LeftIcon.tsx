// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { IconSizes, IconProps } from './types';

const DEFAULT_STROKE_COLOR = '';
const DEFAULT_FILL_COLOR = '#9191A8'; // gray40

export const LeftIcon: React.FC<IconProps> = ({
  stroke = DEFAULT_STROKE_COLOR,
  size = IconSizes.REGULAR,
  fill = DEFAULT_FILL_COLOR,
}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <title>Left</title>
      <defs>
        <path
          d="M11.694 13l4.136-3.987c.4-.385 1.034-.38 1.427.013a.982.982 0 01-.013 1.401l-4.843 4.67a1.017 1.017 0 01-.857.273 1.005 1.005 0 01-.577-.28l-4.743-4.656a.99.99 0 01-.007-1.408 1.01 1.01 0 011.42-.006L11.695 13z"
          id="prefix__left_icon"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="prefix__b" fill="#fff">
          <use xlinkHref="#prefix__left_icon" />
        </mask>
        <use
          fill={fill}
          stroke={stroke}
          transform="rotate(90 11.736 12.055)"
          xlinkHref="#prefix__left_icon"
        />
      </g>
    </svg>
  );
};
