import React, { Component, PropTypes } from 'react';
import { sample, shuffle } from 'lodash';

import FlipMove from '../../src';
import Controls from './Controls';


const baseStyles = {
  bodyContainerStyles: {
    background: '#F3F3F3',
    padding: '100px',
    minHeight: '100%',
  },
  flipMoveContainerStyles: { paddingTop: '20px' },
  listItemStyles: {
    position: 'relative',
    fontFamily: '"Helvetica Neue", "San Francisco", sans-serif',
    padding: '10px',
    background: '#FFFFFF',
    borderBottom: '1px solid #DDD',
  },
};
class FlipMoveWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.items,
    };

    this.removeItem = this.removeItem.bind(this);
    this.removeAllItems = this.removeAllItems.bind(this);
    this.restoreItems = this.restoreItems.bind(this);
    this.rotateItems = this.rotateItems.bind(this);
    this.shuffleItems = this.shuffleItems.bind(this);
    this.runSequence = this.runSequence.bind(this);
    this.restartSequence = this.restartSequence.bind(this);
  }

  componentDidMount() {
    if (this.props.sequence) {
      this.runSequence();
    }
  }

  restartSequence() {
    this.restoreItems();

    window.setTimeout(() => {
      this.runSequence(0);
    }, this.props.flipMoveProps.duration || 500);
  }

  runSequence(index = 0) {
    const { eventName, delay, args = [] } = this.props.sequence[index];

    window.setTimeout(() => {
      this[eventName](...args);

      // If it's not the last item in the sequence, queue the next step.
      const nextIndex = index + 1;
      const nextItem = this.props.sequence[nextIndex];

      if (nextItem) {
        this.runSequence(nextIndex);
      }
    }, delay);
  }

  removeItem(itemId) {
    // Randomly remove one, if no specific itemId is provided.
    if (typeof itemId === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      itemId = sample(this.state.items).id;
    }

    const itemIndex = this.state.items.findIndex(item => item.id === itemId);

    const newItems = this.state.items.slice();
    newItems.splice(itemIndex, 1);

    this.setState({ items: newItems });
  }

  removeAllItems() {
    this.setState({ items: [] });
  }

  restoreItems() {
    this.setState({ items: this.props.items });
  }

  rotateItems() {
    const newItems = this.state.items.slice();
    newItems.unshift(newItems.pop());

    this.setState({ items: newItems });
  }

  shuffleItems() {
    const newItems = shuffle(this.state.items.slice());

    this.setState({ items: newItems });
  }

  renderItems() {
    // Support falsy children by passing them straight to FlipMove
    if (!this.state.items) {
      return this.state.items;
    }

    return this.state.items.map(item => (
      React.createElement(
        this.props.itemType,
        {
          key: item.id,
          id: item.id,
          style: {
            ...baseStyles.listItemStyles,
            ...this.props.listItemStyles,
            // zIndex: item.id.charCodeAt(0),
          },
        },
        item.text
      )
    ));
  }

  render() {
    return (
      <div
        style={{
          ...baseStyles.bodyContainerStyles,
          ...this.props.bodyContainerStyles,
        }}
      >
        <Controls
          onRemove={this.removeItem}
          onRemoveAll={this.removeAllItems}
          onRestore={this.restoreItems}
          onRotate={this.rotateItems}
          onShuffle={this.shuffleItems}
          onRestartSequence={this.restartSequence}
          numOfCurrentItems={this.state.items ? this.state.items.length : 0}
          numOfTotalItems={this.props.items ? this.props.items.length : 0}
          numOfStepsInSequence={this.props.sequence ? this.props.sequence.length : 0}
        />
        <FlipMove
          style={{
            ...baseStyles.flipMoveContainerStyles,
            ...this.props.flipMoveContainerStyles,
          }}
          duration={500}
          {...this.props.flipMoveProps}
        >
          {this.renderItems()}
        </FlipMove>
      </div>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
FlipMoveWrapper.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
  })),
  flipMoveProps: PropTypes.object,
  itemType: PropTypes.oneOfType([
    PropTypes.string, // for DOM types like 'div'
    PropTypes.func, // for composite components
  ]),
  bodyContainerStyles: PropTypes.object,
  flipMoveContainerStyles: PropTypes.object,
  listItemStyles: PropTypes.object,
  sequence: PropTypes.arrayOf(PropTypes.shape({
    eventName: PropTypes.string,
    delay: PropTypes.number,
  })),
};

FlipMoveWrapper.defaultProps = {
  items: [
    { id: 'a', text: "7 Insecticides You Don't Know You're Consuming" },
    { id: 'b', text: '11 Ways To Style Your Hair' },
    { id: 'c', text: 'The 200 Countries You Have To Visit Before The Apocalypse' },
    { id: 'd', text: 'Turtles: The Unexpected Miracle Anti-Aging Product' },
    { id: 'e', text: 'Divine Intervention: Fashion Tips For The Vatican' },
  ],
  itemType: 'div',
};

export default FlipMoveWrapper;
