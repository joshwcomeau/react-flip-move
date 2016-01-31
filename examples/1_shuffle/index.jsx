import React, { Component, PropTypes } from 'react';
import { render }               from 'react-dom';
import FlipMove from 'react-flip-move';

require('../scss/main.scss');

const articles = [
  { id: 'a', timestamp: 123456, name: 'The Dawn of Time' },
  { id: 'b', timestamp: 333333, name: 'A While Back' },
  { id: 'c', timestamp: 654321, name: 'This Just Happened' }
]

class ListItem extends Component {
  render() {
    return (
      <li id={this.props.id}>
        {this.props.name}
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

  render() {
    console.log(this.state.articles);
    return (
      <div id="shuffle-vertical">
        <header>
          <ButtonToggle clickHandler={this.sortAscending} text="Ascending" />
          <ButtonToggle clickHandler={this.sortDescending} text="Descending" />
        </header>
        <ul>
          <FlipMove>
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
