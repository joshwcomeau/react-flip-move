import React, { Component, PropTypes }  from 'react';
import keydown, { Keys, keydownScoped } from 'react-keydown';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';


import FlipMove from '../TEMP_flip-move';


const NUM_SQUARES = Math.pow(5, 2);
const RED_SQUARE  = Math.floor(NUM_SQUARES / 2);
const { UP, DOWN, LEFT, RIGHT } = Keys;

// Monkeypatching is bad, but so much fun (=
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) return;
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
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

  renderSquares() {
    return this.state.squares.map( square => (
      <div className="square" id={ square.red ? 'red' : null } />
    ));
  }

  @keydownScoped( UP, DOWN, LEFT, RIGHT )
  move(event) {
    const currentIndex = this.state.squares.findIndex( square => square.red );
    switch (event.which) {
      case UP:
        console.log("UP event hit!")
        break;
      case DOWN:
        console.log("DOWN event hit!")
        break;
      case LEFT:
        console.log("LEFT event hit!")
        break;
      case RIGHT:
        console.log("RIGHT event hit!")
        break;
    }
  }

  render() {
    return (
      <div id="board">
        { this.renderSquares() }
      </div>
    );
  }
};

export default Board;
