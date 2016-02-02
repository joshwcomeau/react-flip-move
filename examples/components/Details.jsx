import React, { Component, PropTypes }  from 'react';
import ReactDOM, { render }             from 'react-dom';
import { Link }                         from 'react-router';
import classNames                       from 'classnames';


const ShuffleDetails = ({paths, path}) => (
  <div className="details">
    { details[path] }
  </div>
);

const details = {
  shuffle: (
    <section>
      <h2>List/Grid Reordering</h2>
      <p>Shuffle is a thing!</p>
    </section>
  ),
  square: (
    <section>
      <h2>Red Square</h2>
      <p>Watch it move!</p>
    </section>
  )
}

export default ShuffleDetails;
