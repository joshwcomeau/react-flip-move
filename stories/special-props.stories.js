/* eslint-disable no-console */
import React from 'react';
import { storiesOf } from '@storybook/react';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';

storiesOf('Special Props', module)
  .add('maintainContainerHeight (<div>)', () => (
    <FlipMoveWrapper
      flipMoveProps={{
        maintainContainerHeight: true,
        duration: 1000,
      }}
      flipMoveContainerStyles={{
        border: '1px solid magenta',
        padding: '20px',
        marginTop: '20px',
      }}
    />
  ))
  .add('maintainContainerHeight (<ul>)', () => (
    <FlipMoveWrapper
      itemType="li"
      flipMoveProps={{
        maintainContainerHeight: true,
        duration: 1000,
        typeName: 'ul',
      }}
      flipMoveContainerStyles={{
        border: '1px solid magenta',
        padding: '20px',
        marginTop: '20px',
      }}
    />
  ))
  .add('maintainContainerHeight (<ol>)', () => (
    <FlipMoveWrapper
      itemType="li"
      flipMoveProps={{
        maintainContainerHeight: true,
        duration: 1000,
        typeName: 'ol',
      }}
      flipMoveContainerStyles={{
        border: '1px solid magenta',
        padding: '20px',
        marginTop: '20px',
      }}
    />
  ))
  .add('custom scaling with custom getPosition function', () => {
    function getPosition(node) {
      const rect = node.getBoundingClientRect();
      const newRect = {};

      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const prop in rect) {
        newRect[prop] = rect[prop] / 0.5;
      }

      return newRect;
    }

    return (
      <FlipMoveWrapper
        flipMoveProps={{
          getPosition,
          maintainContainerHeight: true,
          duration: 1000,
        }}
        flipMoveContainerStyles={{
          border: '1px solid magenta',
          padding: '20px',
          marginTop: '20px',
          transform: 'scale(0.5)',
          transformOrigin: 'top center',
        }}
      />
    );
  });
