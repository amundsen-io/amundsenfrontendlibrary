import React from 'react';
import { storiesOf } from '@storybook/react';

import StorySection from '../StorySection';
import Table from '.';

const stories = storiesOf('Components/Table', module);

stories.add('Table', () => (
  <>
    <StorySection title="Basic Table">
      <Table />
    </StorySection>
  </>
));
