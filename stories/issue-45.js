import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import shuffle from 'lodash/shuffle';
import sampleSize from 'lodash/sampleSize';
import range from 'lodash/range';

import FlipMove from '../src/FlipMove.js';

const items = [
  { name: 'Potent Potables' },
  { name: 'The Pen is Mightier' },
  { name: 'Famous Horsemen' },
  { name: 'A Petit Déjeuner' },
  { name: 'Other Potent Potables' },
  { name: 'Other The Pen is Mightier' },
  { name: 'Other Famous Horsemen' },
  { name: 'Other A Petit Déjeuner' },
  { name: 'Final Potent Potables' },
  { name: 'Final The Pen is Mightier' },
  { name: 'Final Famous Horsemen' },
  { name: 'Final A Petit Déjeuner' },
]

storiesOf('Github Issue 45 - smooth interrupt', module)
  .add('default', () => (
    <Controls duration={1500} />
  ));


class Controls extends Component {
  constructor() {
    super();
    this.state = { items }
  }

  buttonClickHandler() {
    this.setState({ items: items.slice(6) });
  }

  restore() {
    this.setState({ items })
  }

  renderItems() {
    return this.state.items.map( item => (
      <div
        key={item.name}
        onClick={() => this.listItemClickHandler(item)}
      >
        <div>{item.name}</div>
      </div>
    ))
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: '50px'}}>
          <button onClick={::this.buttonClickHandler}>Remove</button>
          <button onClick={::this.restore}>add</button>
        </div>
        <FlipMove enterAnimation="elevator" leaveAnimation="elevator">
          { this.renderItems() }
        </FlipMove>
      </div>
    );
  }
}
