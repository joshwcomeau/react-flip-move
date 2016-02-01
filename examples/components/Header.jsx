import React, { Component, PropTypes }  from 'react';
import ReactDOM, { render }             from 'react-dom';
import classNames                       from 'classnames';


class Header extends Component {
  render() {
    return (
      <header id="header">
        <div id="logo">
          <h2>flip move</h2>
        </div>
        <nav>
          <div className="nav-item active">
            <h2><span>1</span></h2>
          </div>
          <div className="nav-item">
            <h2><span>2</span></h2>
          </div>
        </nav>
      </header>
    );
  }
};

export default Header;
