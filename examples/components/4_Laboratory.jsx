import '../helpers/array_helpers';

import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { shuffle }                      from 'lodash';
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
    };

    this.handleSlide = this.handleSlide.bind(this);
    this.shuffleCats = this.shuffleCats.bind(this);
  }

  handleSlide(field, val) {
    this.setState({
      [field]: val
    });
  }

  shuffleCats() {
    this.setState({
      cats: shuffle(this.state.cats)
    })
  }

  render() {
    return (
      <div id="laboratory">
        <CatList {...this.state} />
        <Settings
          {...this.state}
          handleSlide={this.handleSlide}
          shuffleCats={this.shuffleCats}
        />
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
          <div className="col input-area">
            <h6 className="slider-value">{this.props.duration}ms</h6>
            <h5 className="field-name">Duration</h5>
            <ReactSlider
              defaultValue={350}
              min={0}
              max={1000}
              withBars={true}
              onChange={(val) => this.props.handleSlide('duration', val)}
            />
          </div>
          <div className="col input-area">
            <h5>Delay</h5>
            <ReactSlider
              defaultValue={0}
              min={0}
              max={1000}
              withBars={true}
              onChange={(val) => this.props.handleSlide('delay', val)}
            />
          </div>
        </div>

        <div className="shuffle-container">
          <Toggle
            clickHandler={this.props.shuffleCats}
            text="Shuffle" icon="random"
            active={true}
          />
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
        <FlipMove
          duration={this.props.duration}
        >
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
