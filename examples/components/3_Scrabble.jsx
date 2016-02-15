import '../helpers/array_helpers';

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

import FlipMove from 'react-flip-move';
import Toggle from './Toggle.jsx';
import tiles from '../data/tiles.js';


const BOARD_WIDTH   = 11;
const BOARD_HEIGHT  = 7;
const SQUARE_SIZE   = 56;
const TILE_OFFSET   = 3;
const NUM_SQUARES   = BOARD_WIDTH * BOARD_HEIGHT;

@DragDropContext(HTML5Backend)
class Scrabble extends Component {
  constructor(props) {
    super(props);
    this.state = { tiles }

    this.updateDroppedTilePosition = this.updateDroppedTilePosition.bind(this);
    this.resetTiles = this.resetTiles.bind(this);
  }

  updateDroppedTilePosition({x, y}, tile) {
    // Normally, this would be done through a Redux action, but because this
    // is such a contrived example, I'm just passing the action down through
    // the child.

    // Create a copy of the state, find the newly-dropped tile.
    let stateTiles = this.state.tiles.slice();
    const index = stateTiles.findIndex( stateTile => stateTile.id === tile.id );

    // Set it to a new copy of the tile, but with the new coords
    stateTiles[index] = { ...tile, x, y };

    this.setState({ tiles: stateTiles });
  }

  resetTiles() {
    this.setState({ tiles });
  }

  renderTiles() {
    return this.state.tiles.map( (tile, index) => {
      return (
        <Tile
          key={index}
          onDrop={this.updateDroppedTilePosition}
          {...tile}
        />
      );
    });
  }

  renderBoardSquares() {
    // Create a 2D array to represent the board
    // Array#matrix is a monkeypatched, custom method >:)
    const matrix = Array.matrix(BOARD_WIDTH, BOARD_HEIGHT);

    return matrix.map( (row, rowIndex) => (
      row.map( (index) => {
        return (
          <BoardSquare
            x={index}
            y={rowIndex}
            onDrop={this.updateDroppedTilePosition}
          />
        );
      })
    ));
  }

  render() {
    return (
      <div id="scrabble">
        <div className="board-border">
          <div className="board">
            <FlipMove duration={200} staggerDelayBy={150}>
              { this.renderTiles() }
            </FlipMove>
            { this.renderBoardSquares() }
          </div>
        </div>

        <div className="controls">
          <Toggle
            clickHandler={this.resetTiles}
            text="Reset" icon="refresh"
            active={true}
            large={true}
          />
        </div>
      </div>
    );
  }
};

const tileSource = {
  beginDrag(props) { return props; }
};

const tileTarget = {
  drop(props, monitor) {
    const tile1 = props;
    const tile2 = monitor.getItem();

    props.onDrop(tile1, tile2);
    props.onDrop(tile2, tile1);
  }
}

@DropTarget('tile', tileTarget, (connect, monitor) => ({
  connectDropTarget:  connect.dropTarget(),
  isOver:             monitor.isOver()
}))
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
    const {
      connectDropTarget, connectDragSource, isDragging, letter, points, x, y
    } = this.props;

    const styles = {
      left:     x * SQUARE_SIZE - TILE_OFFSET,
      top:      y * SQUARE_SIZE - TILE_OFFSET,
      zIndex:   `${x+1}${y+1}`,
      opacity:  isDragging ? 0.5 : 1
    };

    return connectDropTarget(connectDragSource(
      <div className="tile" style={styles}>
        <span className="tile-letter">{letter}</span>
        <span className="tile-points">{points}</span>
      </div>
    ));
  }
}

const squareTarget = {
  drop(props, monitor) {
    props.onDrop(props, monitor.getItem());
  }
}

@DropTarget('tile', squareTarget, (connect, monitor) => ({
  connectDropTarget:  connect.dropTarget(),
  isOver:             monitor.isOver()
}))
class BoardSquare extends Component {
  renderSquare() {
    const classes = classNames({
      'board-square': true,
      'dragged-over': this.props.isOver
    });

    return <div className={classes}></div>
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


export default Scrabble;
