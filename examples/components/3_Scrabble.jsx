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
import tiles from '../data/tiles.js';


const BOARD_WIDTH   = 11;
const BOARD_HEIGHT  = 7;
const SQUARE_SIZE   = 50;
const TILE_OFFSET   = 3;
const NUM_SQUARES   = BOARD_WIDTH * BOARD_HEIGHT;

@DragDropContext(HTML5Backend)
class Scrabble extends Component {
  constructor(props) {
    super(props);
    this.state = { tiles }
  }

  updateDroppedTilePosition(x, y, tile) {
    // Normally, this would be done through a Redux action, but because this
    // is such a contrived example, I'm just passing the action down through
    // the child.
    console.log("UPDATE", x, y, tile);
  }

  renderTiles() {
    return this.state.tiles.map( (tile, index) => {
      return <Tile key={index} {...tile} />;
    });
  }

  renderBoardSquares() {
    // Create a 2D array to represent the board
    // Using a monkey-patched method, see below >:)
    const matrix = Array.matrix(BOARD_WIDTH, BOARD_HEIGHT);

    return matrix.map( (row, rowIndex) => (
      row.map( (index) => {
        // TODO: Figure out if there's a tile in here. Render it if there is.
        return <BoardSquare x={index} y={rowIndex} />
      })
    ));
  }

  render() {
    return (
      <div id="scrabble">
        <div className="board">
          <FlipMove>
            { this.renderTiles() }
          </FlipMove>
          { this.renderBoardSquares() }
        </div>
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
      left:     x * SQUARE_SIZE - TILE_OFFSET,
      top:      y * SQUARE_SIZE - TILE_OFFSET,
      opacity:  isDragging ? 0.5 : 1
    };

    return connectDragSource(
      <div className="tile" style={styles}>
        <span className="tile-letter">{letter}</span>
        <span className="tile-points">{points}</span>
      </div>
    )
  }
}

const squareTarget = {
  drop(props, monitor) {

  }
}

@DropTarget('square', squareTarget, (connect, monitor) => ({
  connectDropTarget:  connect.dropTarget(),
  isOver:             monitor.isOver()
}))
class BoardSquare extends Component {
  renderSquare() {
    return <div className="board-square"></div>
  }
  render() {
    if ( this.props.tile ) {
      // If this square already has a tile in it, we don't want to allow drops.
      return this.renderSquare();
    } else {
      return this.props.connectDropTarget( this.renderSquare() );
    }
  }
}

Array.range = n => Array.from(new Array(n), (x,i) => i);
Array.matrix = (x, y) => {
  const rows = Array.range(y);
  const columns = Array.range(x);
  return rows.map( (row, i) => columns.slice() );
}

export default Scrabble;
