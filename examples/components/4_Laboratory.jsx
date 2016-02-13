import '../helpers/array_helpers';

import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';

import FlipMove from 'react-flip-move';
import Toggle from './Toggle.jsx';
import cats from '../data/cats.js';


class Laboratory extends Component {
  constructor(props) {
    super(props);
    this.state = { cats }
  }

  render() {
    return (
      <div id="laboratory">
      </div>
    );
  }
};


export default Laboratory;
