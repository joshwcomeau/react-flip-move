import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import shuffle from 'lodash/shuffle';
import sampleSize from 'lodash/sampleSize';

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
  .add('when removing items - accordianVertical', () => (
    <Controls
      mode='remove'
      enterAnimation="accordianVertical"
      leaveAnimation="accordianVertical"
    />
  ))
  .add('when removing items - accordianHorizontal', () => (
    <Controls
      mode='remove'
      enterAnimation="accordianHorizontal"
      leaveAnimation="accordianHorizontal"
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
        from: {
          transform: 'translateY(-100px) rotate(90deg) scale(0)'
        },
        to: {
          transform: '',
        }
      }}
      leaveAnimation={{
        from: {
          transform: '',
        },
        to: {
          transform: 'translateY(100px) rotate(-90deg) scale(0)'
        }
      }}
    />
  ))
  .add('when adding/removing items - custom object with 3D rotate', () => (
    <Controls
      mode='remove'
      enterAnimation={{
        from: {
          transform: 'rotateX(135deg)'
        },
        to: {
          transform: '',
        }
      }}
      leaveAnimation={{
        from: {
          transform: '',
        },
        to: {
          transform: 'rotateX(-120deg)',
          opacity: 0.6
        }
      }}
    />
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

  loadFonts() {
    try{Typekit.load({ async: true });}catch(e){}
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
          <button onClick={::this.restore}>add</button>
        </div>
        <FlipMove {...this.props}>
          { this.renderItems() }
        </FlipMove>
        <script src="https://use.typekit.net/dvn6lri.js"></script>
	      <script>
          { this.loadFonts() }
        </script>
      </div>
    );
  }
}
