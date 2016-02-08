import '../helpers/array_helpers';

import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';
import throttle                         from '../helpers/throttle';

import FlipMove from 'react-flip-move';


const SQUARES_WIDTH   = 9;
const SQUARES_HEIGHT  = 5;
const NUM_SQUARES     = SQUARES_WIDTH * SQUARES_HEIGHT;
const RED_SQUARE      = Math.floor(NUM_SQUARES / 2);

const FLIP_DURATION   = 750;
const [ LEFT, UP, RIGHT, DOWN ] = [37, 38, 39, 40];


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: times(NUM_SQUARES, i => ({
        id: i,
        painted: false,
        red: i === RED_SQUARE
      }))
    };

    this.move = throttle(this.move, { context: this });
  }

  componentDidMount() {
    window.addEventListener('keydown', this.move);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.move);
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
    }, FLIP_DURATION / 6)
  }

  startMove(element, node) {
    this.paintSquare(element, node);
  }

  render() {
    return (
      <div id="board">
        <FlipMove
          duration={FLIP_DURATION}
          easing="cubic-bezier(.12,.36,.14,1.2)"
          onStart={this.startMove.bind(this)}
        >
          { this.renderSquares() }
        </FlipMove>
      </div>
    );
  }
};


export default Board;
