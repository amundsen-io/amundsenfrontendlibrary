// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

export * from './AlertIcon';
export * from './DownIcon';
export * from './UpIcon';

export enum IconSizes {
  REGULAR = 24,
  SMALL = 16,
}

export interface IconProps {
  stroke?: string;
  size?: number;
  fill?: string;
}
