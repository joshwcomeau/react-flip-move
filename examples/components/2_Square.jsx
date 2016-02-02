import React, { Component, PropTypes }  from 'react';
import keydown, { Keys, keydownScoped } from 'react-keydown';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';


import FlipMove from '../TEMP_flip-move';

const SQUARES_PER_EDGE  = 5
const NUM_SQUARES       = Math.pow(SQUARES_PER_EDGE, 2);
const RED_SQUARE        = Math.floor(NUM_SQUARES / 2);
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
    }

    this.setState({
      squares: this.state.squares.slice().move(currentIndex, newIndex)
    });
  }

  render() {
    return (
      <div id="board">
        <FlipMove staggerDurationBy="30">
          { this.renderSquares() }
        </FlipMove>
      </div>
    );
  }
};

export default Board;
