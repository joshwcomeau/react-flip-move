import '../helpers/array_helpers';

import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { times }                        from 'lodash';
import classNames                       from 'classnames';
import ReactSlider                      from 'react-slider';

import FlipMove from 'react-flip-move';
import Toggle from './Toggle.jsx';
import cats from '../data/cats.js';


class Laboratory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 350,
      delay: 0,
      easing: 'ease-in',
      staggerDurationBy: 0,
      staggerDelayBy: 0,
      cats
    }
  }

  render() {
    return (
      <div id="laboratory">
        <CatList {...this.state} />
        <Settings {...this.state} />
      </div>
    );
  }
};

class Settings extends Component {
  render() {
    return (
      <div className="settings card">
        <h2>Settings</h2>
        <div className="row">
          <div className="col">
            <h5>Duration</h5>
            <ReactSlider defaultValue={350} min={0} max={10000} />
          </div>
          <div className="col">
            <h5>Delay</h5>
            <ReactSlider defaultValue={0} min={0} max={10000} />
          </div>
        </div>
      </div>
    )
  }
}

class CatList extends Component {
  renderCats() {
    return this.props.cats.map( cat => <Cat key={cat.id} {...cat} /> );
  }
  render() {
    return (
      <ul className="cat-list">
        <FlipMove>
          { this.renderCats() }
        </FlipMove>
      </ul>
    )
  }
}

class Cat extends Component {
  render() {
    const { name, origin, breed, catchphrase, img, url } = this.props;

    return (
      <li className="cat card">
        <img src={img} className="cat-img" />
        <h3 className="cat-name">{name}</h3>
        <h5 className="cat-catchphrase">{catchphrase}</h5>
        <h6 className="cat-origin">{origin}</h6>
        <div className="clearfix" />
      </li>
    )
  }
}

export default Laboratory;
