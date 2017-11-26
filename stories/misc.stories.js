import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import FlipMove from '../src';
import FlipMoveWrapper from './helpers/FlipMoveWrapper';
import FlipMoveListItem from './helpers/FlipMoveListItem';

['div', FlipMoveListItem].forEach(type => {
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
    .add('Bottom aligned', () => (
      <FlipMoveWrapper
        itemType={type}
        flipMoveProps={{
          verticalAlignment: 'bottom',
        }}
        flipMoveContainerStyles={{
          position: 'absolute',
          bottom: 0,
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
          {
            id: 'c',
            text: 'The 200 Countries You Have To Visit Before The Apocalypse',
          },
          {
            id: 'd',
            text: 'Turtles: The Unexpected Miracle Anti-Aging Product',
          },
        ]}
      />
    ))
    .add('falsy children', () => (
      <FlipMoveWrapper
        itemType={type}
        items={[
          { id: 'a', text: "7 Insecticides You Don't Know You're Consuming" },
          { id: 'b', text: '11 Ways To Style Your Hair' },
          null,
          {
            id: 'c',
            text: 'The 200 Countries You Have To Visit Before The Apocalypse',
          },
          {
            id: 'd',
            text: 'Turtles: The Unexpected Miracle Anti-Aging Product',
          },
        ]}
      />
    ))
    .add('Valid children that resolve to null', () => {
      /* eslint-disable react/prop-types */
      class CustomComponent extends Component {
        render() {
          if (!this.props.isVisible) {
            return null;
          }

          return <div>{this.props.children}</div>;
        }
      }
      /* eslint-enable */

      return (
        <FlipMove>
          <CustomComponent key="a" isVisible>
            Hello!
          </CustomComponent>
          <CustomComponent key="b" isVisible={false}>
            Hi!
          </CustomComponent>
        </FlipMove>
      );
    });
});

storiesOf('Misc - wrapperless', module).add('within a static <div>', () => {
  // eslint-disable-next-line react/no-multi-comp
  class CustomComponent extends Component {
    state = {
      items: ['hello', 'world', 'how', 'are', 'you'],
    };

    componentDidMount() {
      this.intervalId = window.setInterval(() => {
        const { items } = this.state;

        if (items.length === 0) {
          return;
        }

        this.setState({
          items: items.slice(0, items.length - 1),
        });
      }, 1000);
    }

    componentWillUnmount() {
      window.clearInterval(this.intervalId);
    }

    render() {
      return (
        <div
          style={{
            color: 'red',
            marginLeft: 100,
            marginTop: 200,
            border: '1px solid blue',
          }}
        >
          <FlipMove typeName={null}>
            {this.state.items.map(item => <div key={item}>{item}</div>)}
          </FlipMove>
        </div>
      );
    }
  }

  return <CustomComponent />;
});
