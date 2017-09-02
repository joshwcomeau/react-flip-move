import React from 'react';
import { storiesOf } from '@kadira/storybook';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';

storiesOf('Invalid', module).add('Stateless Functional Components', () => {
  const MyComponent = () => <div>Hello there!</div>;

  return <FlipMoveWrapper itemType={MyComponent} />;
});
