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

import 'web-animations-js'
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


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
    // the first render; we only animate transitions between states =)
    if ( !this.state ) return;

    React.Children
      .toArray(previousProps.children)
      .filter(this.childNeedsToBeAnimated.bind(this))
      .forEach(this.animateTransform.bind(this));
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

  getPositionDelta(domNode, key) {
    const newBox  = domNode.getBoundingClientRect();
    const oldBox  = this.state[key];

    return [
      oldBox.left - newBox.left,
      oldBox.top  - newBox.top
    ];
  }

  pickAndPrepAnimationProps(n) {
    // Omit the props that aren't settings for web-animations
    // see: https://facebook.github.io/react/docs/transferring-props.html
    let {
      children, onStart, onFinish, staggerDurationBy,
      ...animationProps
    } = this.props;

    if ( typeof animationProps.duration === 'string' ) {
      animationProps.duration = parseInt(animationProps.duration);
    }
    animationProps.duration += n * this.props.staggerDurationBy;

    return animationProps;
  }

  animateTransform(child, n) {
    const domNode = ReactDOM.findDOMNode( this.refs[child.key] );

    // Get the △X and △Y, and return if the child hasn't budged.
    const [ deltaX, deltaY ] = this.getPositionDelta(domNode, child.key);
    if ( deltaX === 0 && deltaY === 0 ) return;

    let animationProps = this.pickAndPrepAnimationProps(n);

    const player = domNode.animate([
      { transform: `translate(${deltaX}px, ${deltaY}px)`},
      { transform: 'translate(0,0)'}
    ], animationProps);

    if ( this.props.onStart) {
      this.props.onStart(child, domNode);
    }

    if ( this.props.onFinish ) {
      player.addEventListener('finish', () => {
        // Invoke our callback, with our child element and the DOM node.
        this.props.onFinish(child, domNode);
      });
    }
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
    duration:           PropTypes.oneOfType([
                          PropTypes.string,
                          PropTypes.number
                        ]),
    easing:             PropTypes.string,
    delay:              PropTypes.number,
    iterations:         PropTypes.number,
    direction:          PropTypes.string,
    fill:               PropTypes.string,
    onStart:            PropTypes.func,
    onFinish:           PropTypes.func,
    staggerDurationBy:  PropTypes.oneOfType([
                          PropTypes.string,
                          PropTypes.number
                        ])
  };

  static defaultProps = {
    duration:           350,
    easing:             'ease-in-out',
    delay:              0,
    iterations:         1,
    direction:          'normal',
    fill:               'none',
    staggerDurationBy:  0
  };
}

export default FlipMove;
