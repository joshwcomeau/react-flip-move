import React, { Component, PropTypes }  from 'react';
import ReactDOM, { render }             from 'react-dom';
import classNames                       from 'classnames';
import { Router, Route, Link }          from 'react-router';

import Header from './Components/Header.jsx';
import Shuffle from './1_Shuffle.jsx';

require('./scss/main.scss');


class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        { this.props.children }
      </div>
    );
  }
};

render((
  <Router>
    <Route path="/" component={App}>
      <Route path="shuffle" component={Shuffle}/>
    </Route>
  </Router>
), document.getElementById('app'))
