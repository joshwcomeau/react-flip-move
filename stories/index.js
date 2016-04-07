import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import shuffle from 'lodash/shuffle';
import sampleSize from 'lodash/sampleSize';

import FlipMove from '../src/FlipMove.js';

storiesOf('FlipMove', module)
  .add('simple transition', () => (
    <Controls />
  ))
  .add('when animation is disabled', () => (
    <Controls disableAnimations={true} />
  ))
  .add('when adding/removing items', () => (
    <Controls mode='add-and-remove' duration={5000} />
  ))




// Controlling component
const items = [
  { name: 'Potent Potables' },
  { name: 'The Pen is Mightier' },
  { name: 'Condiments' },
  { name: 'Japan US Relations' },
  { name: 'Famous Horsemen' },
  { name: 'A Petit Déjeuner' }
]
class Controls extends Component {
  constructor() {
    super();
    this.state = { items }
  }

  renderItems() {
    const styles = {
      padding: '0.5rem',
      margin: '0.5rem',
      background: '#F00',
      fontFamily: 'sans-serif',
      listStyleType: 'none',
      width: '200px'
    }
    return this.state.items.map( item => (
      <li style={styles} key={item.name}>{item.name}</li>
    ))
  }

  clickHandler() {
    let newItems;

    switch ( this.props.mode ) {
      case 'add-and-remove':
        // let numToDisplay = Math.ceil(Math.random() * items.length);
        // newItems = sampleSize(items, numToDisplay);
        newItems = items.slice(1)
        break;
      default:
        newItems = shuffle(items);
        break;
    }

    this.setState({ items: newItems });
  }

  render() {
    return (
      <div>
        <button onClick={::this.clickHandler}>Shuffle</button>
        <FlipMove {...this.props}>
          { this.renderItems() }
        </FlipMove>
      </div>
    );
  }
}
