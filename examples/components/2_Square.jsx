import React, { Component, PropTypes }  from 'react';
import keydown, { Keys, keydownScoped } from 'react-keydown';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';

import FlipMove from '../TEMP_flip-move';


const SQUARES_WIDTH   = 9;
const SQUARES_HEIGHT  = 5;
const NUM_SQUARES     = SQUARES_WIDTH * SQUARES_HEIGHT;
const RED_SQUARE      = Math.floor(NUM_SQUARES / 2);

const FLIP_DURATION   = 200;
const [ LEFT, UP, RIGHT, DOWN ] = [37, 38, 39, 40];


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: times(NUM_SQUARES, i => ({
        id: i,
        painted: false,
        red: i === RED_SQUARE
      })),
      isMoving: false
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
        painted: square.painted
      });

      return <div key={square.id} className={classes} {...square} />;
    });
  }

  move(event) {
    if ( this.state.isMoving ) return false;

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
    // For visual flair, we're going to colour the tiles as they pass under us.
    // We'll do this by adding a state to the square, and we'll delay it so
    // that it happens while the Fuscia Square is covering it.

    // Don't paint the Fuscia square!
    if ( element.props.red ) return;

    // Wait half the duration of the FlipMove animation, and then paint it!
    setTimeout( () => {
      const squares = this.state.squares.slice();
      const squareIndex = squares.findIndex( s => s.id === parseInt(node.id) );
      squares[squareIndex].painted = true;
      this.setState({ squares });
    }, FLIP_DURATION / 2)
  }

  startMove(element, node) {
    this.setState({ isMoving: true });
    this.paintSquare(element, node);
  }

  finishMove() {
    this.setState({ isMoving: false })
  }

  render() {
    return (
      <div id="board">
        <FlipMove
          duration={FLIP_DURATION}
          onStart={this.startMove.bind(this)}
          onFinish={this.finishMove.bind(this)}
        >
          { this.renderSquares() }
        </FlipMove>
      </div>
    );
  }
};


// Monkeypatching is bad, but so much fun (=
Array.prototype.swap = function (a, b) {
  if ( b >= this.length || b < 0 ) return this;

  // Temporary variable to hold data while we juggle
  let temp = this[a];
  this[a] = this[b];
  this[b] = temp;
  return this;
};


export default Board;
