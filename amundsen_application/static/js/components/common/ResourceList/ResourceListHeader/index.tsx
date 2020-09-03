// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import './styles.scss';

import {
    DATASET_HEADER_TITLE,
    SOURCE_HEADER_TITLE,
    BADGES_HEADER_TITLE
} from './constants'

type ResourceListHeaderProps = {
  children: React.ReactNode;
};

const ResourceListHeader: React.FC = ({}: ResourceListHeaderProps) => {
  return (
      <div className='resource-list-header'>
        <span className='dataset'>{DATASET_HEADER_TITLE}</span>
        <span className='source'>{SOURCE_HEADER_TITLE}</span>
        <span className='badges'>{BADGES_HEADER_TITLE}</span>
      </div>
  );
};

export default ResourceListHeader;
