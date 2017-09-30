import React from 'react';
import { storiesOf } from '@storybook/react';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';
import FlipMoveListItem from './helpers/FlipMoveListItem';

['div', FlipMoveListItem].forEach(type => {
  const typeLabel = type === 'div' ? 'native' : 'composite';

  storiesOf(`Appear Animations - ${typeLabel}`, module)
    .add('Default (disabled)', () => <FlipMoveWrapper itemType={type} />)
    .add('preset - elevator', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ appearAnimation: 'elevator' }}
      />
    ))
    .add('preset - fade', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ appearAnimation: 'fade' }}
      />
    ))
    .add('preset - accordionVertical', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ appearAnimation: 'accordionVertical' }}
      />
    ))
    .add('preset - accordionHorizontal', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{ appearAnimation: 'accordionHorizontal' }}
        flipMoveContainerStyles={{
          whiteSpace: 'nowrap',
        }}
        listItemStyles={{
          display: 'inline-block',
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          borderRight: '1px solid #DDD',
        }}
      />
    ))
    .add('boolean - `true` (default preset)', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          appearAnimation: true,
        }}
      />
    ))
    .add('boolean - `false` (disabled)', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          appearAnimation: false,
        }}
      />
    ))
    .add('fade with stagger', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          appearAnimation: 'fade',
          staggerDelayBy: 50,
          staggerDurationBy: 50,
        }}
      />
    ))
    .add('accordionVertical with stagger', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          appearAnimation: 'accordionVertical',
          duration: 150,
          staggerDelayBy: 125,
        }}
      />
    ))
    .add('invalid preset (default preset)', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          appearAnimation: 'fsdajfsdhjhskfhas',
        }}
      />
    ));
});
