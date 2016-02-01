import React, { Component, PropTypes }  from 'react';
import ReactDOM, { render }             from 'react-dom';
import moment                           from 'moment';
import { shuffle }                      from 'lodash';


import FlipMove from '../TEMP_flip-move';

require('../scss/main.scss');

const articles = [
  { id: 'a', timestamp: 1401336000000, name: 'The Dawn of Time' },
  { id: 'b', timestamp: 1426305600000, name: 'A While Back' },
  { id: 'c', timestamp: 1439006400000, name: 'This Just Happened' },
  { id: 'd', timestamp: 1451710800000, name: 'Another Headline' },
  { id: 'e', timestamp: 1452315600000, name: 'Whatever will we do' },
  { id: 'f', timestamp: 1453525200000, name: 'Words' },
  { id: 'g', timestamp: 1500000000000, name: 'This Just Happened' }
]

class ListItem extends Component {
  render() {
    return (
      <li id={this.props.id} className="list-item">
        <h3>{this.props.name}</h3>
        <h5>{moment(this.props.timestamp).format('MMM Do, YYYY')}</h5>
      </li>
    );
  }
};

class ListParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: this.props.articles
    };

    this.sortAscending = this.sortAscending.bind(this);
    this.sortDescending = this.sortDescending.bind(this);
    this.sortShuffle = this.sortShuffle.bind(this);
  }

  renderArticles() {
    return this.state.articles.map( article => (
      <ListItem key={article.id} {...article} />
    ));
  }

  sortAscending() {
    this.setState({
      articles: this.state.articles.sort( (a, b) => a.timestamp - b.timestamp)
    });
  }

  sortDescending() {
    this.setState({
      articles: this.state.articles.sort( (a, b) => b.timestamp - a.timestamp)
    });
  }

  sortShuffle() {
    this.setState({
      articles: shuffle(this.state.articles)
    });
  }

  render() {
    return (
      <div id="shuffle-vertical">
        <header>
          <ButtonToggle clickHandler={this.sortShuffle} text="Shuffle" />
          <ButtonToggle clickHandler={this.sortAscending} text="Ascending" />
          <ButtonToggle clickHandler={this.sortDescending} text="Descending" />
        </header>
        <ul>
          <FlipMove staggerDurationBy="25">
            { this.renderArticles() }
          </FlipMove>
        </ul>
      </div>
    );
  }
};

const ButtonToggle = ({clickHandler, text, icon}) => (
  <button className="button-toggle" onClick={clickHandler}>
    {text}
  </button>
)

render(
  <ListParent articles={articles} />,
  document.getElementById('app')
);
