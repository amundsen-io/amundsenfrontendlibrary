import React from 'react';
import { storiesOf } from '@storybook/react';

import { ImageIconType } from 'interfaces/Enums';
import StorySection from '../StorySection';
import Alert from '.';

const stories = storiesOf('Components/Alert', module);

stories.add('Alert', () => (
  <>
    <StorySection title="Alert">
      <Alert
        message="Alert text that can be short"
        onAction={() => {
          alert('message closed!');
        }}
      />
    </StorySection>
    <StorySection title="Alert with Action">
      <Alert
        message="Alert text that can be short"
        actionText="Action Text"
        onAction={() => {
          alert('message closed!');
        }}
      />
    </StorySection>
  </>
));
