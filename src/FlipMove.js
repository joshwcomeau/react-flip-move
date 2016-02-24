/**
 * React Flip Move
 * (c) 2016-present Joshua Comeau
 *
 * How it works:
 * The basic idea with this component is pretty straightforward:
 *
 *   - We track all rendered elements by their `key` property, and we keep
 *     their bounding boxes (their top/left/right/bottom coordinates) in this
 *     component's state.
 *   - When the component updates, we compare its former position (held in
 *     state) with its new position (derived from the DOM after update).
 *   - If the two have moved, we use the FLIP technique to animate the
 *     transition between their positions.
 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { whichTransitionEvent } from './helpers.js';
import propConverter            from './prop-converter';

const transitionEnd = whichTransitionEvent();


@propConverter
class FlipMove extends Component {
  componentWillReceiveProps() {
    // Get the bounding boxes of all currently-rendered, keyed children.
    // Store it in this.state.
    const newState = this.props.children.reduce( (state, child) => {
      // It is possible that a child does not have a `key` property;
      // Ignore these children, they don't need to be moved.
      if ( !child.key ) return state;

      const domNode     = ReactDOM.findDOMNode( this.refs[child.key] );
      const boundingBox = domNode.getBoundingClientRect();

      return { ...state, [child.key]: boundingBox };
    }, {});

    this.setState(newState);
  }

  componentDidUpdate(previousProps) {
    // Re-calculate the bounding boxes of tracked elements.
    // Compare to the bounding boxes stored in state.
    // Animate as required =)

    // On the very first render, `componentWillReceiveProps` is not called.
    // This means that `this.state` will be undefined.
    // That's alright, though, because there is no possible transition on
    // the first render; we only animate transitions between state changes =)
    if ( !this.state ) return;

    previousProps.children
      .filter(this.childNeedsToBeAnimated.bind(this))
      .forEach(this.animateTransform.bind(this));
  }

  childNeedsToBeAnimated(child) {
    // We only want to animate if:
    //  * The child has an associated key (immovable children are supported)
    //  * The child still exists in the DOM.
    //  * The child isn't brand new.
    //  * The child has moved
    //
    // Tackle the first three first, since they're very easy to determine.
    const isImmovable   = !child.key;
    const isBrandNew    = !this.state[child.key];
    const isDestroyed   = !this.refs[child.key];
    if ( isImmovable || isBrandNew || isDestroyed ) return;

    // Figuring out if the component has moved is a bit more work.
    const domNode       = ReactDOM.findDOMNode( this.refs[child.key] );
    const [ dX, dY ]    = this.getPositionDelta( domNode, child.key );
    const isStationary  = dX === 0 && dY === 0;

    // If it hasn't budged, we don't have to animate it.
    return !isStationary;
  }

  getPositionDelta(domNode, key) {
    const newBox  = domNode.getBoundingClientRect();
    const oldBox  = this.state[key];

    return [
      oldBox.left - newBox.left,
      oldBox.top  - newBox.top
    ];
  }

  createTransitionString(n) {
    let { duration, staggerDurationBy, delay, staggerDelayBy, easing } = this.props;

    delay     += n * staggerDelayBy;
    duration  += n * staggerDurationBy;

    return `transform ${duration}ms ${easing} ${delay}ms`;
  }

  animateTransform(child, n) {
    let domNode = ReactDOM.findDOMNode( this.refs[child.key] );

    // Get the △X and △Y
    const [ dX, dY ] = this.getPositionDelta(domNode, child.key);

    domNode.style.transition = 'transform 0ms';
    domNode.style.transform = `translate(${dX}px, ${dY}px)`;

    // Sadly, this is the most browser-compatible way to do this I've found.
    // Essentially we need to set the initial styles outside of any request
    // callbacks to avoid batching them. Then, a frame needs to pass with
    // the styles above rendered. Then, on the second frame, we can apply
    // our final styles to perform the animation.
    requestAnimationFrame( () => {
      requestAnimationFrame( () => {
        domNode.style.transition = this.createTransitionString(n);
        domNode.style.transform  = '';
      });
    });

    if ( this.props.onStart ) this.props.onStart(child, domNode);
    let onFinishHandler = () =>{
      domNode.style.transition = '';
      if ( this.props.onFinish ) this.props.onFinish(child, domNode);
      domNode.removeEventListener(transitionEnd, onFinishHandler)
    };
    domNode.addEventListener(transitionEnd, onFinishHandler);
  }

  childrenWithRefs () {
    return this.props.children.map( child => {
      return React.cloneElement(child, { ref: child.key });
    });
  }

  render() {
    return React.createElement(
      this.props.typeName,
      { className: this.props.className },
      this.childrenWithRefs()
    );
  }
}



export default FlipMove;
