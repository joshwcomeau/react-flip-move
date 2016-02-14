import '../helpers/array_helpers';

import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { shuffle }                      from 'lodash';
import classNames                       from 'classnames';
import Dropdown                         from 'react-dropdown';
import ReactSlider                      from 'react-slider';

import FlipMove from 'react-flip-move';
import Toggle from './Toggle.jsx';
import cats from '../data/cats.js';


class Laboratory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 800,
      delay: 0,
      easingPreset: { value: '0.42, 0.0, 0.58, 1.0', label: 'ease-in-out' },
      easingValues: ['0.42', '0.0', '0.58', '1.0'],
      staggerDurationBy: 0,
      staggerDelayBy: 20,
      cats
    };

    this.handleSlide = this.handleSlide.bind(this);
    this.shuffleCats = this.shuffleCats.bind(this);
    this.selectEasing = this.selectEasing.bind(this);
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

  selectEasing(selected) {
    this.setState({
      easingPreset: selected,
      easingValues: selected.value.split(',')
    });
  }

  render() {
    return (
      <div id="laboratory">
        <CatList {...this.state} />
        <Settings
          {...this.state}
          handleSlide={this.handleSlide}
          shuffleCats={this.shuffleCats}
          selectEasing={this.selectEasing}
        />
      </div>
    );
  }
};

class Settings extends Component {
  renderDuration() {
    return (
      <div className="col col-3 input-area">
        <h6 className="slider-value">{this.props.duration}ms</h6>
        <h5 className="field-name">Duration</h5>
        <div className="input">
          <ReactSlider
            defaultValue={this.props.duration}
            min={0}
            max={2000}
            withBars={true}
            onChange={(val) => this.props.handleSlide('duration', val)}
          />
        </div>
      </div>
    );
  }

  renderDelay() {
    return (
      <div className="col col-2 input-area">
        <h6 className="slider-value">{this.props.delay}ms</h6>
        <h5 className="field-name">Delay</h5>
        <div className="input">
          <ReactSlider
            defaultValue={this.props.delay}
            min={0}
            max={1000}
            withBars={true}
            onChange={(val) => this.props.handleSlide('delay', val)}
          />
        </div>
      </div>
    );
  }

  renderEasing() {
    return (
      <div className="col input-area">
        <h5 className="field-name">Easing</h5>
        <div className="input">
          <Dropdown
            name="easing"
            options={[
              { value: '0,0,1.0,1.0',         label: 'linear' },
              { value: '0.25,0.1,0.25,1.0',   label: 'ease' },
              { value: '0.42,0.0,1.0,1.0',    label: 'ease-in' },
              { value: '0.0,0.0,0.58,1.0',    label: 'ease-out' },
              { value: '0.42,0.0,0.58,1.0',   label: 'ease-in-out' },
              { value: '0.39,0,0.45,1.4',     label: 'custom (cubic bezier)', custom: true },
            ]}
            value={this.props.easing}
            onChange={this.props.selectEasing}
          />
          <div className="dropdown-spacer" style={{height: 40}} />
        </div>
      </div>
    );
  }

  renderCubicBezier() {
    if ( !this.props.easingPreset.custom ) return;

    return (
      <div className="col input-area">
        <h5 className="field-name">Cubic Bezier</h5>
        <div className="input">
          <input type="text" />
          <input type="text" />
          <input type="text" />
          <input type="text" />
        </div>

      </div>
    )
  }

  renderStaggeredDuration() {
    return (
      <div className="col input-area">
        <h6 className="slider-value">{this.props.staggerDurationBy}ms</h6>
        <h5 className="field-name">Stagger Duration By</h5>
        <div className="input">
          <ReactSlider
            defaultValue={this.props.staggerDurationBy}
            min={0}
            max={500}
            withBars={true}
            onChange={(val) => this.props.handleSlide('staggerDurationBy', val)}
          />
        </div>
      </div>
    );
  }
  renderStaggeredDelay() {
    return (
      <div className="col input-area">
        <h6 className="slider-value">{this.props.staggerDelayBy}ms</h6>
        <h5 className="field-name">Stagger Delay By</h5>
        <div className="input">
          <ReactSlider
            defaultValue={this.props.staggerDelayBy}
            min={0}
            max={500}
            withBars={true}
            onChange={(val) => this.props.handleSlide('staggerDelayBy', val)}
          />
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="settings card">
        <h2>Settings</h2>
        <div className="row">
          { this.renderDuration() }
          { this.renderDelay() }
        </div>

        <div className="row">
          { this.renderEasing() }
          { this.renderCubicBezier() }
        </div>

        <div className="row">
          { this.renderStaggeredDuration() }
          { this.renderStaggeredDelay() }
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
  formatEasing() {
    return `cubic-bezier(${ this.props.easingValues.join(',') })`;
  }
  render() {
    return (
      <ul className="cat-list">
        <FlipMove
          duration={this.props.duration}
          delay={this.props.delay}
          easing={this.formatEasing()}
          staggerDurationBy={this.props.staggerDurationBy}
          staggerDelayBy={this.props.staggerDelayBy}
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
