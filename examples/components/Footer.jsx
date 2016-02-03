import React, { Component, PropTypes }  from 'react';
import ReactDOM, { render }             from 'react-dom';
import { Link }                         from 'react-router';
import classNames                       from 'classnames';

import data                             from '../data/details';

// God this footer is hideous.
// Will refactor if I have the time.
const Footer = ({paths, path}) => {
  const currentPathIndex = paths.indexOf(path);
  const prevPath = paths[currentPathIndex-1];
  const nextPath = paths[currentPathIndex+1];
  const hasData  = !!data[path];

  return (
    <footer id="details">
      <div className="centering-wrapper">
        { generateLink('previous', prevPath, hasData) }
        { generateLink('next', nextPath, hasData) }

        { hasData ? <h2>{data[path].title}</h2> : null }
        { hasData ? <p>{data[path].details} <a href={data[path].source} target="_blank">View Source</a></p> : null }

        <p className="copyright">
          © Joshua Comeau, 2016 – <span className="mono">new Date()</span>. All rights, wrongs, and grey areas reserved.
        </p>
      </div>
    </footer>
  );
};

function generateLink(direction, linkTo, hasData) {
  if ( !hasData ) return;

  let linkClass = `arrow ${direction}`;
  if ( linkTo ) linkClass += ' enabled';

  const iconClass = `fa fa-angle-${direction === 'next' ? 'right' : 'left'}`;
  return (
    <div className={linkClass}>
      <i className={iconClass} />
      { linkTo ? <Link to={linkTo} /> : null}
    </div>
  );
}

export default Footer;
