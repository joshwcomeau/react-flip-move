import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';

import FlipMove from '../TEMP_flip-move';


const BOARD_WIDTH   = 11;
const BOARD_HEIGHT  = 7;
const SQUARE_SIZE   = 42;
const NUM_SQUARES   = BOARD_WIDTH * BOARD_HEIGHT;

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

class Tile extends Component {
  render() {
    const styles = {
      left: this.props.x * SQUARE_SIZE,
      top:  this.props.y * SQUARE_SIZE
    };

    return (
      <div className="tile" style={styles}>
        <span className="letter">{this.props.letter}</span>
        <span className="points">{this.props.points}</span>
      </div>
    )
  }
}

export default Scrabble;
