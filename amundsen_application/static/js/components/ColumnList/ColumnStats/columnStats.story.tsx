// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { storiesOf } from '@storybook/react';

import StorySection from 'components/common/StorySection';
import ColumnStats from '.';
// import TestDataBuilder from './testDataBuilder';

// const dataBuilder = new TestDataBuilder();

const stories = storiesOf('Components/ColumnStats', module);

stories.add('Column Stats', () => (
  <>
    <StorySection title="Basic Use">
      <ColumnStats
        stats={[
          {
            end_epoch: 1571616000,
            start_epoch: 1571616000,
            stat_type: 'count',
            stat_val: '12345',
          },
          {
            end_epoch: 1571616000,
            start_epoch: 1571616000,
            stat_type: 'count_null',
            stat_val: '123',
          },
          {
            end_epoch: 1571616000,
            start_epoch: 1571616000,
            stat_type: 'count_distinct',
            stat_val: '22',
          },
          {
            end_epoch: 1571616000,
            start_epoch: 1571616000,
            stat_type: 'count_zero',
            stat_val: '44',
          },
          {
            end_epoch: 1571616000,
            start_epoch: 1571616000,
            stat_type: 'max',
            stat_val: '1237466454',
          },
          {
            end_epoch: 1571616000,
            start_epoch: 1571616000,
            stat_type: 'min',
            stat_val: '856',
          },
          {
            end_epoch: 1571616000,
            start_epoch: 1571616000,
            stat_type: 'avg',
            stat_val: '2356575',
          },
          {
            end_epoch: 1571616000,
            start_epoch: 1571616000,
            stat_type: 'stddev',
            stat_val: '1234563',
          },
        ]}
      />
    </StorySection>
  </>
));
