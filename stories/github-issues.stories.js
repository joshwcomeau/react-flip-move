import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import shuffle from 'lodash/shuffle';
import sampleSize from 'lodash/sampleSize';
import range from 'lodash/range';

import FlipMoveWrapper from './helpers/FlipMoveWrapper';
import FlipMove from '../src/FlipMove.js';

const items = [
  { name: 'Potent Potables' },
  { name: 'The Pen is Mightier' },
  { name: 'Famous Horsemen' },
  { name: 'A Petit Déjeuner' }
]

storiesOf('Github Issues', module)
  .add('#31', () => (
    <Controls duration={400} />
  ))
  .add('#141' , () => {
    let count = 0;
    return (
      <FlipMoveWrapper
        items={range(100).map(i => {return {id: `${i}`, text: `Header ${i}`}})}
        flipMoveContainerStyles={{
          position: 'relative',
          height: '500px',
          overflow: 'scroll'
        }}
        listItemStyles={{
          position: 'sticky',
          top: 0,
          height: 20,
          backgroundColor: 'black',
          color: 'white'
        }}
      />
    )
  });


class Controls extends Component {
  constructor() {
    super();
    this.state = { items: items.slice() }
  }

  buttonClickHandler() {
    let newItems = this.state.items.slice();
    newItems.splice(1, 1);

    this.setState({ items: newItems });
  }

  listItemClickHandler(clickedItem) {
    this.setState({
      items: this.state.items.filter( item => item !== clickedItem )
    });
  }

  restore() {
    this.setState({ items })
  }

  renderItems() {
    const answerWrapperStyle = {
      backgroundColor: '#FFF',
      borderRadius: '20px',
      padding: '1em 2em',
      marginBottom: '1em',
      minWidth: 400
    }

    const answerStyle = {
      fontSize: '16px'
    }
    return this.state.items.map( item => (
      <div
        style={answerWrapperStyle}
        key={item.name}
        onClick={() => this.listItemClickHandler(item)}
      >
        <div style={answerStyle}>{item.name}</div>
      </div>
    ))
  }

  render() {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '600px',
        background: '#DDD'
      }}>
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
