import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';

import FlipMove from '../TEMP_flip-move';


const SQUARES_WIDTH   = 11;
const SQUARES_HEIGHT  = 7;
const NUM_SQUARES     = SQUARES_WIDTH * SQUARES_HEIGHT;

class Scrabble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [
        { letter: 'F', points: 4, x: 1, y: 2 },
        { letter: 'L', points: 2, x: 2, y: 2 },
        { letter: 'I', points: 1, x: 3, y: 2 },
        { letter: 'P', points: 2, x: 4, y: 2 },
        { letter: 'M', points: 6, x: 6, y: 2 },
        { letter: 'O', points: 1, x: 7, y: 2 },
        { letter: 'V', points: 8, x: 8, y: 2 },
        { letter: 'E', points: 2, x: 9, y: 2 }
      ]
    }
  }

  renderTiles() {
    return this.state.tiles.map( tile => (
      <div className="tile">
        <span className="letter">{tile.letter}</span>
        <span className="points">{tile.points}</span>
      </div>
    ))
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

export default Scrabble;
