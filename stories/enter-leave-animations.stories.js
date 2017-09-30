import React from 'react';
import { storiesOf } from '@storybook/react';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';
import FlipMoveListItem from './helpers/FlipMoveListItem';

['div', FlipMoveListItem].forEach(type => {
  const typeLabel = type === 'div' ? 'native' : 'composite';

  storiesOf(`Enter/Leave Animations - ${typeLabel}`, module)
    .add('default (elevator preset)', () => <FlipMoveWrapper itemType={type} />)
    .add('default (elevator preset) with constantly change item', () => (
      <FlipMoveWrapper itemType={type} applyContinuousItemUpdates />
    ))
    .add('preset - fade', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: 'fade',
          leaveAnimation: 'fade',
        }}
      />
    ))
    .add('preset - accordionVertical', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: 'accordionVertical',
          leaveAnimation: 'accordionVertical',
        }}
      />
    ))
    .add('preset - accordionHorizontal', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: 'accordionHorizontal',
          leaveAnimation: 'accordionHorizontal',
        }}
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
    .add('preset - mixed', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: 'fade',
          leaveAnimation: 'elevator',
        }}
      />
    ))
    .add('custom Enter animation', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: {
            from: {
              transform: 'translateY(-100px) scaleY(0)',
            },
            to: {
              transform: '',
            },
          },
        }}
      />
    ))
    .add('custom Enter and Leave animation, 2D rotate', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: {
            from: { transform: 'translateY(-100px) rotate(90deg) scale(0)' },
            to: { transform: '' },
          },
          leaveAnimation: {
            from: { transform: '' },
            to: { transform: 'translateY(100px) rotate(-90deg) scale(0)' },
          },
        }}
      />
    ))
    .add('custom Enter and Leave animation, 3D rotate', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveContainerStyles={{ perspective: 500 }}
        flipMoveProps={{
          duration: 1000,
          enterAnimation: {
            from: { transform: 'rotateX(180deg)', opacity: 0 },
            to: { transform: '' },
          },
          leaveAnimation: {
            from: { transform: '' },
            to: { transform: 'rotateX(180deg)', opacity: 0 },
          },
        }}
      />
    ))
    .add('boolean - `false` enter (disabled enter)', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: false,
        }}
      />
    ))
    .add('boolean - `false` enter/leave (disabled enter/leave)', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: false,
          leaveAnimation: false,
        }}
      />
    ))
    .add('boolean - `true` (default preset)', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: true,
          leaveAnimation: true,
        }}
      />
    ))
    .add('invalid preset (default preset)', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          enterAnimation: 'fsdajfsdhjhskfhas',
          leaveAnimation: 'fsdifjdsoafhasfnsiubgs',
        }}
      />
    ));
});
