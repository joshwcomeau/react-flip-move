import React from 'react';
import { storiesOf } from '@kadira/storybook';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';
import FlipMoveListItem from './helpers/FlipMoveListItem';
import FlipMoveListItemLegacy from './helpers/FlipMoveListItemLegacy';


storiesOf('Basic Behaviour', module)
  .add('native (<div>) children', () => (
    <FlipMoveWrapper />
  ))
  .add('composite (<FlipMoveListItem>) children', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
    />
  ))
  .add('Original composite (<FlipMoveListItemLegacy>) children (createClass)', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItemLegacy}
    />
  ))
  .add('with long duration', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{ duration: 2000 }}
    />
  ))
  .add('with long delay', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{ delay: 500 }}
    />
  ));

const easings = ['linear', 'ease-in', 'ease-out', 'cubic-bezier(1,0,0,1)'];
easings.forEach((easing) => {
  storiesOf('Easings', module)
    .add(easing, () => (
      <FlipMoveWrapper
        itemType={FlipMoveListItem}
        flipMoveProps={{
          easing,
          duration: 850,
        }}
      />
    ));
});

storiesOf('Staggers', module)
  .add('short duration stagger', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{ staggerDurationBy: 50 }}
    />
  ))
  .add('medium duration stagger', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{ staggerDurationBy: 250 }}
    />
  ))
  .add('long duration stagger', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{ staggerDurationBy: 500 }}
    />
  ))
  .add('short delay stagger', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{ staggerDelayBy: 30 }}
    />
  ))
  .add('medium delay stagger', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{ staggerDelayBy: 100 }}
    />
  ))
  .add('long delay stagger', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{ staggerDelayBy: 250 }}
    />
  ))
  .add('mixed delay and duration stagger', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{
        staggerDurationBy: 100,
        staggerDelayBy: 45,
      }}
    />
  ));

storiesOf('Disabled animations', module)
  .add('with disableAllAnimations prop', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{
        disableAllAnimations: true,
      }}
    />
  ))
  .add('with all timing props set to 0', () => (
    <FlipMoveWrapper
      itemType={FlipMoveListItem}
      flipMoveProps={{
        duration: 0,
      }}
    />
  ));

storiesOf('Type names', module)
  .add('ul/li', () => (
    <FlipMoveWrapper
      itemType="li"
      flipMoveProps={{
        typeName: 'ul',
      }}
    />
  ))
  .add('ol/li', () => (
    <FlipMoveWrapper
      itemType="li"
      flipMoveProps={{
        typeName: 'ol',
      }}
    />
  ));
