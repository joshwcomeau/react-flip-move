import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';

import FlipMove from '../TEMP_flip-move';


const NUM_SQUARES = Math.pow(5, 2);
const RED_SQUARE  = Math.floor(NUM_SQUARES / 2)

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

  render() {
    return (
      <div id="board">
        { this.renderSquares() }
      </div>
    );
  }
};

export default Board;
