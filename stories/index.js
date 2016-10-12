import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import shuffle from 'lodash/shuffle';
import sampleSize from 'lodash/sampleSize';
import range from 'lodash/range';
import _ from 'lodash';

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
  .add('with centered flex content', () => (
    <Controls style={{display: 'flex', justifyContent: 'center'}} />
  ))
  .add('with transition on child', () => (
    <Controls
      styleFirstChild={true}
      firstChildInnerStyles={{
        transition: '100ms',
        backgroundColor: '#F00'
      }}
    />
  ))
  .add('with onStartAll callback', () => (
    <Controls
      onStartAll={(elements, nodes) => console.log("Started with", elements, nodes)}
    />
  ))
  .add('when prop keys do not change, but items rearrange', () => (
    <StaticItems />
  ))
  .add('delegated prop - width', () => (
    <Controls typeName="table" width="50%" />
  ))
  .add('inside a scaled container', () => (
    <Controls style={{transform: 'scale(0.5)'}} getPosition={getPosition} />
  ))
  .add('empty', () => {
    class HandleEmpty extends Component {
      constructor(props) {
        super(props);

        this.state = {
          empty: true,
        };
      }

      render() {
        return (
          <div>
            <button
              onClick={() => this.setState({ empty: !this.state.empty })}
            >
              Toggle!
            </button>

            <FlipMove>
              {this.state.empty ? null : <div>Not empty!</div>}
            </FlipMove>
          </div>
        )
      }
    }

    return <HandleEmpty />
  })
  .add('maintain container height', () => (
    <Controls
      maintainContainerHeight={true}
      style={{border: 'solid 2px magenta', padding: '7px' }}
      childOuterStyles={{ margin: '20px' }}
    />
  ))

function getPosition(node) {
  const rect = node.getBoundingClientRect();
  const newRect = {};

  for (const prop in rect) {
    newRect[prop] = rect[prop] / 0.5;
  }

  return newRect;
}


// Controlling component
const items = [
  { name: 'Potent Potables' },
  { name: 'The Pen is Mightier' },
  { name: 'Famous Horsemen' },
  { name: 'A Petit Déjeuner' },

]
class Controls extends Component {
  static defaultProps = {
    firstChildOuterStyles: {},
    firstChildInnerStyles: {},
    childInnerStyles: {},
    childOuterStyles: {},
  };

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
        newItems = shuffle(this.state.items);
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

    return this.state.items.map( (item, i) => {
      // Make a working copy of styles
      let stylesOuterCopy = { ...stylesOuter, ...this.props.childOuterStyles };
      let stylesInnerCopy = { ...stylesInner, ...this.props.childInnerStyles };

      if ( this.props.styleFirstChild && item.name === 'Potent Potables' ) {
        stylesOuterCopy = {
          ...stylesOuterCopy,
          ...this.props.firstChildOuterStyles
        };

        stylesInnerCopy = {
          ...stylesInnerCopy,
          ...this.props.firstChildInnerStyles
        };
      }

      return <li
        key={item.name}
        style={stylesOuterCopy}
        onClick={() => this.listItemClickHandler(item)}
      >
        <div style={stylesInnerCopy}><button style={{transition: '0.1s background-color'}}>{item.name}</button></div>
      </li>
    });
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
