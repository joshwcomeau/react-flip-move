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
    // the first render; we only animate transitions between states =)
    if ( !this.state ) return;

    const childrenToAnimate = previousProps.children.filter(
      this.childNeedsToBeAnimated.bind(this)
    );

    childrenToAnimate.forEach( (child, index) => {
      // The new box can be calculated from the current DOM state.
      // The old box was stored in this.state when the component received props.
      const domNode = ReactDOM.findDOMNode( this.refs[child.key] );
      const newBox  = domNode.getBoundingClientRect();
      const oldBox  = this.state[child.key];
      const deltaX  = oldBox.left - newBox.left;
      const deltaY  = oldBox.top  - newBox.top;

      if ( deltaX || deltaY ) {
        this.animateTransform(domNode, deltaX, deltaY, index);
      }
    });
  }

  childNeedsToBeAnimated(child) {
    // We only want to animate if:
    //  * The child has an associated key (stationary children are supported)
    //  * The child still exists in the DOM.
    //  * The child isn't brand new.
    const isStationary = !child.key;
    const isBrandNew   = !this.state[child.key];
    const isDestroyed  = !this.refs[child.key];

    return !isStationary && !isBrandNew && !isDestroyed;
  }

  animateTransform(domNode, deltaX, deltaY, index) {
    let settings = {...this.props};
    if ( typeof settings.duration === 'string' ) {
      settings.duration = parseInt(settings.duration);
    }

    settings.duration += index * settings.staggerDurationBy;

    domNode.animate([
      { transform: `translate(${deltaX}px, ${deltaY}px)`},
      { transform: 'translate(0,0)'}
    ], settings);
  }

  childrenWithRefs () {
    return this.props.children.map(child => {
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
    children:   PropTypes.array.isRequired,
    duration:   PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    easing:     PropTypes.string,
    delay:      PropTypes.number,
    iterations: PropTypes.number,
    direction:  PropTypes.string,
    fill:       PropTypes.string,
    onComplete: PropTypes.func,
    staggerDurationBy: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };

  static defaultProps = {
    duration:   350,
    easing:     'ease-in-out',
    delay:      0,
    iterations: 1,
    direction:  'normal',
    fill:       'none',
    staggerDurationBy: 0
  };
}

export default FlipMove;
