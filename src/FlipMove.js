/**
 * React Flip Move
 * Automagically animate the transition when the DOM gets reordered.
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

import { convertToInt, whichTransitionEvent } from './helpers.js';

const transitionEnd = whichTransitionEvent();


class FlipMove extends Component {
  componentWillReceiveProps() {
    // Ensure we're dealing with an array, and not an only child.
    const children = React.Children.toArray(this.props.children);

    // Get the bounding boxes of all currently-rendered, keyed children.
    // Store it in this.state.
    const newState = children.reduce( (state, child) => {
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

    React.Children
      .toArray(previousProps.children)
      .filter(this.childNeedsToBeAnimated.bind(this))
      .forEach(this.animateTransform.bind(this));
  }

  childNeedsToBeAnimated(child) {
    // We only want to animate if:
    //  * The child has an associated key (immovable children are supported)
    //  * The child still exists in the DOM.
    //  * The child isn't brand new.
    //  * The child has moved
    const isImmovable   = !child.key;
    const isBrandNew    = !this.state[child.key];
    const isDestroyed   = !this.refs[child.key];

    const domNode       = ReactDOM.findDOMNode( this.refs[child.key] );
    const [ dX, dY ]    = this.getPositionDelta( domNode, child.key );
    const isStationary  = dX === 0 && dY === 0;

    return !isImmovable && !isBrandNew && !isDestroyed && !isStationary;
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

    // There has to be a nicer way to do this...
    [ duration, delay, staggerDurationBy, staggerDelayBy ] = convertToInt(
      duration, delay, staggerDurationBy, staggerDelayBy
    );

    delay     += n * staggerDelayBy;
    duration  += n * staggerDurationBy;

    return `transform ${duration}ms ${easing} ${delay}ms`;
  }

  animateTransform(child, n) {
    let domNode = ReactDOM.findDOMNode( this.refs[child.key] );

    // Get the △X and △Y
    const [ dX, dY ] = this.getPositionDelta(domNode, child.key);

    // TODO: Don't clobber existing properties!
    domNode.style.transition = '';
    domNode.style.transform = `translate(${dX}px, ${dY}px)`;

    // Sadly, this is the most browser-compatible way to do this I've found.
    // Essentially we need to set the initial styles outside of any request
    // callbacks to avoid batching them. Then, a frame needs to pass with
    // the styles above rendered. Then, on the second frame, we can apply
    // our final styles to perform the animation.
    requestAnimationFrame( (t1) => {
      requestAnimationFrame( (t2) => {
        domNode.style.transition = this.createTransitionString(n);
        domNode.style.transform  = '';
      });
    });

    if ( this.props.onStart ) this.props.onStart(child, domNode);

    domNode.addEventListener(transitionEnd, () => {
      domNode.style.transition = '';
      if ( this.props.onFinish ) this.props.onFinish(child, domNode);
    });
  }

  childrenWithRefs () {
    // Convert the children to an array, and map.
    // Cannot use React.Children.map directly, because the #toArray method
    // re-maps some of the keys ('1' -> '.$1'). We need this behaviour to
    // be consistent, so we do this conversion upfront.
    // See: https://github.com/facebook/react/pull/3650/files
    return React.Children.toArray(this.props.children).map( child => {
      return React.cloneElement(child, { ref: child.key });
    });
  }

  render() {
    return (
      <div>
        {this.childrenWithRefs()}
      </div>
    );
  }

  static propTypes = {
    children:           PropTypes.oneOfType([
                          PropTypes.array,
                          PropTypes.object
                        ]).isRequired,
    easing:             PropTypes.string,
    duration:           PropTypes.oneOfType([
                          PropTypes.string,
                          PropTypes.number
                        ]),
    delay:              PropTypes.oneOfType([
                          PropTypes.string,
                          PropTypes.number
                        ]),
    staggerDurationBy:  PropTypes.oneOfType([
                          PropTypes.string,
                          PropTypes.number
                        ]),
    staggerDelayBy:     PropTypes.oneOfType([
                          PropTypes.string,
                          PropTypes.number
                        ]),
    onStart:            PropTypes.func,
    onFinish:           PropTypes.func
  };

  static defaultProps = {
    easing:             'ease-in-out',
    duration:           350,
    delay:              0,
    staggerDurationBy:  0,
    staggerDelayBy:     0
  };
}



export default FlipMove;
