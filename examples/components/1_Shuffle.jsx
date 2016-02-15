import React, { Component, PropTypes }  from 'react';
import moment                           from 'moment';
import { shuffle }                      from 'lodash';
import classNames                       from 'classnames';

import articles from '../data/articles';

import FlipMove from 'react-flip-move';
import Toggle from './Toggle.jsx';


class ListItem extends Component {
  render() {
    const listClass = `list-item card ${this.props.view}`;

    return (
      <li id={this.props.id} className={listClass}>
        <h3>{this.props.name}</h3>
        <h5>{moment(this.props.timestamp).format('MMM Do, YYYY')}</h5>
      </li>
    );
  }
};


class Shuffle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'list',
      order: 'asc',
      sortingMethod: 'chronological',
      articles
    };

    this.toggleList   = this.toggleList.bind(this);
    this.toggleGrid   = this.toggleGrid.bind(this);
    this.toggleSort   = this.toggleSort.bind(this);
    this.sortShuffle  = this.sortShuffle.bind(this);
    this.sortRotate   = this.sortRotate.bind(this);
  }

  toggleList() {
    this.setState({
      view: 'list'
    });
  }

  toggleGrid() {
    this.setState({
      view: 'grid'
    });
  }

  toggleSort() {
    const sortAsc   = (a, b) => a.timestamp - b.timestamp;
    const sortDesc  = (a, b) => b.timestamp - a.timestamp;

    this.setState({
      order: (this.state.order === 'asc' ? 'desc' : 'asc'),
      sortingMethod: 'chronological',
      articles: this.state.articles.sort(
        this.state.order === 'asc' ? sortDesc : sortAsc
      )
    });
  }

  sortShuffle() {
    this.setState({
      sortingMethod: 'shuffle',
      articles: shuffle(this.state.articles)
    });
  }

  sortRotate() {
    let articles = this.state.articles.slice();
    articles.unshift(articles.pop())

    this.setState({
      sortingMethod: 'rotate',
      articles
    });
  }

  renderArticles() {
    return this.state.articles.map( (article, i) => {
      return (
        <ListItem
          key={article.id}
          view={this.state.view}
          style={{ zIndex: i }}
          {...article}
        />
      );
    });
  }

  render() {
    return (
      <div id="shuffle" className={this.state.view}>
        <header>
          <div className="abs-left">
            <Toggle
              clickHandler={this.toggleList}
              text="List" icon="list"
              active={this.state.view === 'list'}
            />
            <Toggle
              clickHandler={this.toggleGrid}
              text="Grid" icon="th"
              active={this.state.view === 'grid'}
            />
          </div>
          <div className="abs-right">
            <Toggle
              clickHandler={this.toggleSort}
              text={this.state.order === 'asc' ? 'Ascending' : 'Descending'}
              icon={this.state.order === 'asc' ? 'angle-up' : 'angle-down'}
              active={this.state.sortingMethod === 'chronological'}
            />
            <Toggle
              clickHandler={this.sortShuffle}
              text="Shuffle" icon="random"
              active={this.state.sortingMethod === 'shuffle'}
            />
            <Toggle
              clickHandler={this.sortRotate}
              text="Rotate" icon="refresh"
              active={this.state.sortingMethod === 'rotate'}
            />
          </div>
        </header>
        <ul>
          <FlipMove staggerDurationBy="30" duration={500}>
            { this.renderArticles() }
          </FlipMove>
        </ul>
      </div>
    );
  }
};

export default Shuffle;
