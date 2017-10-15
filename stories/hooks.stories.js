/* eslint-disable no-console */
import React from 'react';
import { storiesOf } from '@storybook/react';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';

let time = Date.now();

storiesOf('Hooks', module).add('Storybook actions (see console)', () => (
  <FlipMoveWrapper
    flipMoveProps={{
      duration: 1000,
      onStart(...args) {
        console.info('Element start', ...args);
      },
      onStartAll(...args) {
        time = Date.now();
        console.info('All elements start', ...args);
      },
      onFinish(...args) {
        console.info('Element finish', ...args);
      },
      onFinishAll(...args) {
        console.info('All elements finished', ...args);
        console.info('TOTAL DURATION', Date.now() - time);
      },
    }}
  />
));
