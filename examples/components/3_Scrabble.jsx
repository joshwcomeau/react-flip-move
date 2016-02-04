import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';
import HTML5Backend                     from 'react-dnd-html5-backend';
import {
  DragSource,
  DropTarget,
  DragDropContext
}                                       from 'react-dnd';

import FlipMove from '../TEMP_flip-move';


const BOARD_WIDTH   = 11;
const BOARD_HEIGHT  = 7;
const SQUARE_SIZE   = 42;
const NUM_SQUARES   = BOARD_WIDTH * BOARD_HEIGHT;

@DragDropContext(HTML5Backend)
class Scrabble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [
        { letter: 'F', points: 4, x: 1, y: 3 },
        { letter: 'L', points: 2, x: 2, y: 3 },
        { letter: 'I', points: 1, x: 3, y: 3 },
        { letter: 'P', points: 2, x: 4, y: 3 },
        { letter: 'M', points: 6, x: 6, y: 3 },
        { letter: 'O', points: 1, x: 7, y: 3 },
        { letter: 'V', points: 8, x: 8, y: 3 },
        { letter: 'E', points: 2, x: 9, y: 3 }
      ]
    }
  }

  renderTiles() {
    return this.state.tiles.map( (tile, index) => {
      return <Tile key={index} {...tile} />;
    });
  }

  render() {
    return (
      <div id="scrabble">
        <FlipMove>
          { this.renderTiles() }
        </FlipMove>
      </div>
    );
  }
};

const tileSource = {
  beginDrag(props) { return props; }
};

@DragSource('tile', tileSource, (connect, monitor) => ({
  connectDragSource:  connect.dragSource(),
  isDragging:         monitor.isDragging()
}))
class Tile extends Component {
  static propTypes = {
    x:                  PropTypes.number.isRequired,
    y:                  PropTypes.number.isRequired,
    letter:             PropTypes.string.isRequired,
    points:             PropTypes.number.isRequired,
    connectDragSource:  PropTypes.func.isRequired,
    isDragging:         PropTypes.bool.isRequired
  };

  render() {
    const { connectDragSource, isDragging, letter, points, x, y } = this.props;
    const styles = {
      left:     x * SQUARE_SIZE,
      top:      y * SQUARE_SIZE,
      opacity:  isDragging ? 0.5 : 1
    };

    return connectDragSource(
      <div className="tile" style={styles}>
        <span className="letter">{letter}</span>
        <span className="points">{points}</span>
      </div>
    )
  }
}

const squareTarget = {
  drop(props, monitor) {

  }
}

class BoardSquare extends Component {
  render() {
  if ( this.props.tile ) {
    // If this square already has a tile in it, we don't want to allow drops.
    return this.renderSquare();
  } else {
    return this.props.connectDropTarget( this.renderSquare() );
  }
}

}

export default Scrabble;
