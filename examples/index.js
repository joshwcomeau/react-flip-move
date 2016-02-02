import React, { Component, PropTypes }    from 'react';
import ReactDOM, { render }               from 'react-dom';
import classNames                         from 'classnames';
import { Router, Route, Link }            from 'react-router';
import keydown, { Keys }                  from 'react-keydown';

import Header   from './Components/Header.jsx';
import Shuffle  from './Components/1_Shuffle.jsx';
import Square   from './Components/2_Square.jsx';

require('./scss/main.scss');


// Capture keydown events app-wide.
// Descendant components may use these keys to perform actions
// eg. the Square demo uses them to move a red square about =)
class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        { this.props.children && React.cloneElement(this.props.children, {keydown: this.props.keydown}) }
      </div>
    );
  }
};

render((
  <App />
), document.getElementById('app'))
