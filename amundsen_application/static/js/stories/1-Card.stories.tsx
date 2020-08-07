import React from 'react';

import Card from '../components/common/Card';

export default {
  title: 'Cards',
  component: Card,
};

export const SimpleCard = () => {
  return (
    <Card
      title="Test Title"
      subtitle="Test Subtitle"
      copy="Test Copy for the card."
    />
  );
};

SimpleCard.story = {
  name: 'simple card',
};
