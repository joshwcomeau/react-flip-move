import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import shuffle from 'lodash/shuffle';
import sampleSize from 'lodash/sampleSize';
import range from 'lodash/range';

import FlipMove from '../src/FlipMove.js';

storiesOf('FlipMove', module)
  .add('simple transition', () => (
    <Controls duration={400} />
  ))
  .add('when animation is disabled', () => (
    <Controls disableAllAnimations={true} />
  ))
  .add('when removing items - elevator (default)', () => (
    <Controls
      mode='remove'
    />
  ))
  .add('when removing items - fade', () => (
    <Controls
      mode='remove'
      enterAnimation="fade"
      leaveAnimation="fade"
    />
  ))
  .add('when removing items - accordionVertical', () => (
    <Controls
      mode='remove'
      enterAnimation="accordionVertical"
      leaveAnimation="accordionVertical"
    />
  ))
  .add('when removing items - accordionHorizontal', () => (
    <Controls
      mode='remove'
      enterAnimation="accordionHorizontal"
      leaveAnimation="accordionHorizontal"
    />
  ))
  .add('when removing items - none', () => (
    <Controls
      mode='remove'
      enterAnimation={false}
      leaveAnimation={false}
    />
  ))
  .add('when adding/removing items - custom object with default "leave"', () => (
    <Controls
      mode='remove'
      enterAnimation={{
        from: {
          transform: 'translateY(-100px)',
        },
        to: {
          transform: '',
        }
      }}
    />
  ))
  .add('when adding/removing items - custom object with rotate', () => (
    <Controls
      mode='remove'
      enterAnimation={{
        from: { transform: 'translateY(-100px) rotate(90deg) scale(0)' },
        to: { transform: '' }
      }}
      leaveAnimation={{
        from: { transform: '' },
        to: { transform: 'translateY(100px) rotate(-90deg) scale(0)' }
      }}
    />
  ))
  .add('when adding/removing items - custom object with 3D rotate', () => (
    <Controls
      mode='remove'
      enterAnimation={{
        from: { transform: 'rotateX(135deg)' },
        to: { transform: '' }
      }}
      leaveAnimation={{
        from: { transform: '' },
        to: { transform: 'rotateX(-120deg)',   opacity: 0.6 }
      }}
    />
  ))
  .add('with custom styles', () => (
    <Controls style={{display: 'flex', justifyContent: 'center'}} />
  ))
  .add('when prop keys do not change, but items rearrange', () => (
    <StaticItems />
  ))

// Controlling component
const items = [
  { name: 'Potent Potables' },
  { name: 'The Pen is Mightier' },
  { name: 'Famous Horsemen' },
  { name: 'A Petit Déjeuner' },

]
class Controls extends Component {
  constructor() {
    super();
    this.state = { items: items.slice() }
  }

  buttonClickHandler() {
    let newItems;

    switch ( this.props.mode ) {
      case 'remove':
        newItems = this.state.items.slice();
        newItems.splice(1, 1);
        break;

      case 'rotate':
        newItems = this.state.items.slice();
        let newTopItem = newItems.pop();
        newTopItem.name += Math.random();
        newItems.unshift( newTopItem );
        break;

      default:
        newItems = shuffle(items);
        break;
    }

    this.setState({ items: newItems });
  }

  listItemClickHandler(clickedItem) {
    this.setState({
      items: this.state.items.filter( item => item !== clickedItem )
    });
  }

  restore() {
    this.setState({
      items
    })
  }

  renderItems() {
    const stylesOuter = {
      position: 'relative',
      display: 'block',
      padding: '6px',
      listStyleType: 'none',
    }

    const stylesInner = {
      padding: '8px',
      background: '#FFFFFF',
      color: '#F34D93',
      fontFamily: 'sans-serif',
      borderRadius: '4px'
    }
    return this.state.items.map( item => (
      <li
        style={stylesOuter}
        key={item.name}
        onClick={() => this.listItemClickHandler(item)}
      >
        <div style={stylesInner}>{item.name}</div>
      </li>
    ))
  }

  render() {
    return (
      <div style={{
        padding: '50px',
        backgroundColor: '#333636',
        minHeight: '600px'
      }}>
        <div style={{marginBottom: '50px'}}>
          <button onClick={::this.buttonClickHandler}>Remove</button>
          <button onClick={::this.restore}>Restore</button>
        </div>
        <FlipMove {...this.props}>
          { this.renderItems() }
        </FlipMove>
      </div>
    );
  }
}

class StaticItems extends Component {
  renderItems() {
    return range(4).map( i => {
      let left = Math.floor(Math.random() * 100) + 'px';
      let top  = Math.floor(Math.random() * 100) + 'px';

      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            padding: '1rem',
            background: '#F00',
            left,
            top
          }}
        >
          Item!
        </div>
      );
    })
  }

  render() {
    return (
      <div>
        <button onClick={() => this.forceUpdate.call(this, null)}>
          UPDATE
        </button>
        <FlipMove>
          { this.renderItems() }
        </FlipMove>
      </div>
    );
  }
}
