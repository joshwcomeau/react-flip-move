import React, { Component } from 'react';
import { storiesOf } from '@kadira/storybook';

import FlipMove from '../src';
import FlipMoveWrapper from './helpers/FlipMoveWrapper';
import FlipMoveListItem from './helpers/FlipMoveListItem';

['div', FlipMoveListItem].forEach((type) => {
  const typeLabel = type === 'div' ? 'native' : 'composite';

  storiesOf(`Sequencing - ${typeLabel}`, module)
    .add('uninterrupted shuffles', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ duration: 500 }}
        sequence={[
          { eventName: 'shuffleItems', delay: 20 },
          { eventName: 'shuffleItems', delay: 600 },
          { eventName: 'shuffleItems', delay: 800 },
          { eventName: 'shuffleItems', delay: 500 },
          { eventName: 'shuffleItems', delay: 500 },
          { eventName: 'shuffleItems', delay: 1000 },
        ]}
      />
    ))
    .add('interrupted shuffles', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ duration: 500 }}
        sequence={[
          { eventName: 'shuffleItems', delay: 20 },
          { eventName: 'shuffleItems', delay: 600 },
          { eventName: 'shuffleItems', delay: 200 },
          { eventName: 'shuffleItems', delay: 700 },
          { eventName: 'shuffleItems', delay: 50 },
          { eventName: 'shuffleItems', delay: 150 },
          { eventName: 'shuffleItems', delay: 250 },
          { eventName: 'shuffleItems', delay: 350 },
          { eventName: 'shuffleItems', delay: 450 },
          { eventName: 'shuffleItems', delay: 350 },
          { eventName: 'shuffleItems', delay: 500 },
        ]}
      />
    ))
});
