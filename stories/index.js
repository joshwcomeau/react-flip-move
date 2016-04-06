import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import shuffle from 'lodash/shuffle';
import sampleSize from 'lodash/sampleSize';

import FlipMove from '../src/FlipMove.js';

storiesOf('FlipMove', module)
  .add('with 3 items', () => (
    <Controls />
  ));




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
    this.setState({ items: sampleSize(shuffle(items), 4) });
  }

  render() {
    return (
      <div>
        <FlipMove>
          { this.renderItems() }
        </FlipMove>
        <button onClick={::this.shuffle}>Shuffle</button>
      </div>
    );
  }
}
