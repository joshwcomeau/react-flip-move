import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import shuffle from 'lodash/shuffle';
import sampleSize from 'lodash/sampleSize';

import FlipMove from '../src/FlipMove.js';

storiesOf('FlipMove', module)
  .add('when animation is disabled', () => (
    <Controls disableAnimations={true} />
  ))
  .add('when adding/removing items', () => (
    <Controls subset={true} />
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
      padding: '1rem',
      background: '#FFF',
      fontFamily: 'sans-serif',
      listStyleType: 'none'
    }
    return this.state.items.map( item => (
      <li style={styles} key={item.name}>{item.name}</li>
    ))
  }

  shuffle() {
    // We may want to also add/remove some nodes at random, to test the
    // enter/exit animations. If so, we want to sample a subset.
    let numToDisplay;
    if ( this.props.subset ) {
      numToDisplay = Math.ceil(Math.random() * items.length);
    } else {
      numToDisplay = items.length
    }
    this.setState({ items: sampleSize(shuffle(items), numToDisplay) });
  }

  render() {
    return (
      <div>
        <button onClick={::this.shuffle}>Shuffle</button>
        <FlipMove {...this.props}>
          { this.renderItems() }
        </FlipMove>
      </div>
    );
  }
}
