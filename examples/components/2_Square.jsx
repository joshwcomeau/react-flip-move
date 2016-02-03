import React, { Component, PropTypes }  from 'react';
import keydown, { Keys, keydownScoped } from 'react-keydown';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';

import FlipMove from '../TEMP_flip-move';


const SQUARES_WIDTH  = 9;
const SQUARES_HEIGHT = 5;
const NUM_SQUARES    = SQUARES_WIDTH * SQUARES_HEIGHT;
const RED_SQUARE     = Math.floor(NUM_SQUARES / 2);
const [ LEFT, UP, RIGHT, DOWN ] = [37, 38, 39, 40];

// Going over a square leaves an imprint that lasts N ticks:
const IMPRINT_TICK_LENGTH = 10;

// Monkeypatching is bad, but so much fun (=
Array.prototype.swap = function (a, b) {
  if ( b >= this.length || b < 0 ) return this;

  // Temporary variable to hold data while we juggle
  let temp = this[a];
  this[a] = this[b];
  this[b] = temp;
  return this;
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: times(NUM_SQUARES, i => ({
        id: i,
        imprint: 0,
        red: i === RED_SQUARE
      }))
    };

    this.move = this.move.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.move);
  }

  renderSquares() {
    return this.state.squares.map( square => {
      const classes = classNames({
        square: true,
        red: square.red,
        [`imprint-${square.imprint}`]: true
      });

      return <div key={square.id} className={classes} {...square} />;
    });
  }

  move(event) {
    const currentIndex = this.state.squares.findIndex( square => square.red );
    let newIndex;

    switch (event.which) {
      case UP:
        newIndex = currentIndex - SQUARES_WIDTH;
        break;
      case DOWN:
        newIndex = currentIndex + SQUARES_WIDTH;
        break;
      case LEFT:
        newIndex = currentIndex - 1;
        break;
      case RIGHT:
        newIndex = currentIndex + 1;
        break;
      default:
        return;
    }

    this.setState({
      squares: this.state.squares.slice().swap(currentIndex, newIndex)
    });
  }

  paintSquare(element, node) {
    // Don't paint the Fuscia square!
    if ( element.props.red ) return;

    let nextSquares = this.state.squares.slice().map( square => {
      if ( element.props.id === square.id ) {
        square.imprint = IMPRINT_TICK_LENGTH;
      } else {
        // Decrement square.imprint, but don't allow it to go below zero.
        square.imprint = square.imprint <= 0 ? 0 : square.imprint - 1;
      }
      return square;
    });

    this.setState({
      squares: nextSquares
    });
  }

  render() {
    return (
      <div id="board">
        <FlipMove duration="200" onStart={this.paintSquare.bind(this)}>
          { this.renderSquares() }
        </FlipMove>
      </div>
    );
  }
};

export default Board;
