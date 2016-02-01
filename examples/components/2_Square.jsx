import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';
import keydown, { Keys }                from 'react-keydown';

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

@keydown(UP, DOWN, LEFT, RIGHT)
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

  componentWillReceiveProps( { keydown } ) {
    if ( keydown.event ) {
      // inspect the keydown event and decide what to do
      console.log( keydown.event.which );
    }
  }

  move(event) {
    // TODO: Directions aside from right =)
    console.log("Move fired!", this, event)
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
