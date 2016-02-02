import React, { Component, PropTypes }  from 'react';
import keydown, { Keys, keydownScoped } from 'react-keydown';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';

import FlipMove from '../TEMP_flip-move';


const SQUARES_PER_EDGE  = 5;
const NUM_SQUARES       = Math.pow(SQUARES_PER_EDGE, 2);
const RED_SQUARE        = Math.floor(NUM_SQUARES / 2);
const [ LEFT, UP, RIGHT, DOWN ] = [37, 38, 39, 40];

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
        red: i === RED_SQUARE
      }))
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.move.bind(this));
  }

  renderSquares() {
    return this.state.squares.map( square => (
      <div key={square.id} className="square" id={ square.red ? 'red' : null } />
    ));
  }

  move(event) {
    const currentIndex = this.state.squares.findIndex( square => square.red );
    let newIndex;

    switch (event.which) {
      case UP:
        newIndex = currentIndex - SQUARES_PER_EDGE;
        break;
      case DOWN:
        newIndex = currentIndex + SQUARES_PER_EDGE;
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

  render() {
    return (
      <div id="board">
        <FlipMove duration="200">
          { this.renderSquares() }
        </FlipMove>
      </div>
    );
  }
};

export default Board;
