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
  .add('#120', () => {
    class Example extends React.Component {
      counter = 0;

      constructor(props) {
        super(props);
        this.state = {
          items: [],
        };
      }

      onRemoveItem = () => {
        const { items } = this.state;
        this.setState({
          items: items.slice(0, items.length - 1),
        });
      };

      onAddItem = () => {
        this.setState({
          items: this.state.items.concat(['item' + ++this.counter]),
        });
      };

      handleAddItems = calls => {
        let items = [];
        for (let i = 0; i < calls; i++) {
          items.push('item' + ++this.counter);
        }
        this.setState(prevState => ({
          items,
        }));
      };

      onAddItems = () => {
        setTimeout(this.handleAddItems(50), 0);
        setTimeout(this.handleAddItems(50), 20);
      };

      render() {
        const { items } = this.state;

        return (
          <div>
            <section>
              <button onClick={this.onRemoveItem}>Remove item</button>
              <button onClick={this.onAddItem}>Add item</button>
              <button onClick={() => this.onAddItems()}>Add many items</button>
            </section>
            <FlipMove
              typeName={'ul'}
              duration="200"
              enterAnimation={{
                from: {
                  transform: 'translateX(-10%)',
                  opacity: 0.1,
                },
                to: {
                  transform: 'translateX(0)',
                  opacity: 1,
                },
              }}
              leaveAnimation={{
                from: {
                  transform: 'translateX(0)',
                  opacity: 1,
                },
                to: {
                  transform: 'translateX(-10%)',
                  opacity: 0.0,
                },
              }}
            >
              {items.map(item =>
                <li key={item} id={item}>
                  {item}
                </li>,
              )}
            </FlipMove>
          </div>
        );
      }
    }

    return (
      <div>
        <legend>
          Spam "add many items" button, then inspect first element. it will be
          overlayed by a zombie element that wasnt correctle removed from the
          DOM
        </legend>
        <Example />
      </div>
    );
  })
  .add('#141', () => {
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
