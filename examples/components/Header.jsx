import React, { Component, PropTypes }  from 'react';
import ReactDOM, { render }             from 'react-dom';
import { Link }                         from 'react-router';
import classNames                       from 'classnames';

import FlipMove from 'react-flip-move';


const HEADER_HEIGHT = 75;

class Header extends Component {
  // Because FlipMove only works one level deep (doesn't look at grandchildren),
  // we can't yet just wrap our <Link>s in a <FlipMove>.
  // Maybe something to add into v1, although the performance implications
  // might outweigh the benefits (A special 'traverse-deep' mode?)
  // The solution is to have 3 layers: The Link itself, the moving active
  // fuscia circle, and the static inactive grey circles.
  generateCurrentHighlight() {
    // All our nav items are square, so their width is equal to the header
    // height. We will just offset it by the reverse index, since if it's
    // over the LAST item, it's offset by 0*HEADER_HEIGHT. If it's penultimate,
    // it's offset by 1*HEADER_HEIGHT, etc.
    const reversedPaths   = this.props.paths.reverse();
    const reversedIndex   = reversedPaths.indexOf(this.props.path);
    const offsetFromRight = reversedIndex * HEADER_HEIGHT + "px";

    return (
      <FlipMove>
        <div
          key="current-circle"
          className="circle current"
          style={{ right: offsetFromRight }}
        />
      </FlipMove>
    );
  }

  generateGrayHighlight() {
    return this.props.paths.map( (path, i) => (
      <div className="circle" key={i} />
    ));
  }

  generateNavLinks() {
    return this.props.paths.map( (path, i) => {
      const classes = classNames({
        'nav-item': true,
        'current': path === this.props.path
      });

      return (
        <Link key={i} to={path} className={classes}>
          <h2>{i+1}</h2>
        </Link>
      );
    });
  }

  render() {
    return (
      <header id="header">
        <Link to="/" id="logo">
          <h2>flip move</h2>
        </Link>
        <nav>
          <div className="nav-layer links">
            { this.generateNavLinks() }
          </div>
          <div className="nav-layer current-circle">
            { this.generateCurrentHighlight() }
          </div>
          <div className="nav-layer gray-circles">
            { this.generateGrayHighlight() }
          </div>
        </nav>
      </header>
    );
  }
};

export default Header;
