import React from 'react';
import { storiesOf } from '@kadira/storybook';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';
import FlipMoveListItem from './helpers/FlipMoveListItem';

['div', FlipMoveListItem].forEach((type) => {
  const typeLabel = type === 'div' ? 'native' : 'composite';

  storiesOf(`Misc - ${typeLabel}`, module)
    .add('Flex - horizontally centered', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveContainerStyles={{ display: 'flex', justifyContent: 'center' }}
        listItemStyles={{
          width: '115px',
          height: '115px',
        }}
      />
    ))
    .add('Flex - vertically centered (BUGGY)', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveContainerStyles={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '400px',
        }}
      />
    ))
    .add('Including children without keys', () => (
      <FlipMoveWrapper
        itemType={type}
        items={[
          { id: 'a', text: "7 Insecticides You Don't Know You're Consuming" },
          { id: 'b', text: '11 Ways To Style Your Hair' },
          { text: 'This item has no key' },
          { id: 'c', text: 'The 200 Countries You Have To Visit Before The Apocalypse' },
          { id: 'd', text: 'Turtles: The Unexpected Miracle Anti-Aging Product' },
        ]}
      />
    ));
});
