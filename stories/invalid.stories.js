import React from 'react';
import { storiesOf } from '@storybook/react';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';

storiesOf('Invalid', module).add('Stateless Functional Components', () => {
  const MyComponent = () => <div>Hello there!</div>;

  return <FlipMoveWrapper itemType={MyComponent} />;
});
