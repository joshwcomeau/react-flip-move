import React from 'react';
import { storiesOf } from '@storybook/react';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';
import FlipMoveListItem from './helpers/FlipMoveListItem';

['div', FlipMoveListItem].forEach(type => {
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
    .add('interrupted appear', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ duration: 1000, appearAnimation: 'fade' }}
        sequence={[
          { eventName: 'shuffleItems', delay: 600 },
          { eventName: 'shuffleItems', delay: 300 },
          { eventName: 'shuffleItems', delay: 400 },
        ]}
      />
    ))
    .add('leave during shuffle', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ duration: 500 }}
        sequence={[
          { eventName: 'shuffleItems', delay: 20 },
          { eventName: 'removeItem', delay: 300 },
          { eventName: 'shuffleItems', delay: 400 },
        ]}
      />
    ))
    .add('remove items with interrupt, in order', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ duration: 1000 }}
        sequence={[
          { eventName: 'removeItem', delay: 500, args: ['a'] },
          { eventName: 'removeItem', delay: 200, args: ['b'] },
          { eventName: 'removeItem', delay: 200, args: ['c'] },
          { eventName: 'removeItem', delay: 200, args: ['d'] },
        ]}
      />
    ))
    .add('remove items with interrupt, random order', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ duration: 1000 }}
        sequence={[
          { eventName: 'removeItem', delay: 500 },
          { eventName: 'removeItem', delay: 200 },
          { eventName: 'removeItem', delay: 200 },
          { eventName: 'removeItem', delay: 200 },
        ]}
      />
    ));
});
