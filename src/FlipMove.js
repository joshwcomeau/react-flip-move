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

import { whichTransitionEvent, filterNewItems } from './helpers.js';
import propConverter from './prop-converter';

const transitionEnd = whichTransitionEvent();


@propConverter
class FlipMove extends Component {
  constructor(props) {
    super(props);
    this.items = this.props.children;
    this.boundingBoxes = [];

    this.parentElement  = null;
    this.parentBox      = null;

    this.animateTransform       = this.animateTransform.bind(this);

    // Keep track of remaining animations so we know when to fire the
    // all-finished callback, and clean up after ourselves.
    this.remainingAnimations = 0;
    this.childrenToAnimate   = {
      elements: [],
      domNodes: []
    };
  }

  componentDidMount() {
    this.parentElement = ReactDOM.findDOMNode(this);
  }

  // When the component is handed new props, we need to figure out the "resting"
  // position of all currently-rendered DOM nodes. We store that data in
  // this.boundingBoxes, so it can be used later to work out the animation.
  componentWillReceiveProps(nextProps) {
    // Calculate the parentBox. This is used to find childBoxes relative
    // to the parent container, not the viewport.
    const parentBox = this.parentElement.getBoundingClientRect();

    // Get the bounding boxes of all currently-rendered, keyed children.
    this.boundingBoxes = this.props.children.reduce( (boxes, child) => {
      // It is possible that a child does not have a `key` property;
      // Ignore these children, they don't need to be moved.
      if ( !child.key ) return boxes;

      // Also, if this node is just entering, it isn't in the DOM yet.
      if ( child.entering ) return boxes;

      const domNode     = ReactDOM.findDOMNode( this.refs[child.key] );

      const childBox    = domNode.getBoundingClientRect();
      const relativeBox = {
        'top':  childBox['top']  - parentBox['top'],
        'left': childBox['left'] - parentBox['left']
      };

      return { ...boxes, [child.key]: relativeBox };
    }, {});

    // Create our custom list of items.
    // We use this list instead of props so that we can mutate it.
    // We're keeping just-deleted nodes for a bit longer, as well as adding a
    // flag to just-created nodes, so we know they need to be entered.
    this.items = this.prepareNextItems(nextProps.children);
  }

  prepareNextItems(nextItems) {
    // Start by marking items that are about to be removed as 'exiting'
    let updatedItems = this.items.map( item => {
      const isExiting = !nextItems.find( nextItem => (nextItem.key === item.key) );

      return {
        ...item,
        exiting: isExiting
      };
    });

    // Add in any new items, marking them as 'entering'.
    let enteringItems = filterNewItems(this.items, nextItems).map( item => {
      item.entering = true;
      return item;
    });

    // Concatenate the updated items with the newly-entering ones.
    return updatedItems.concat(enteringItems);
  }

  componentDidUpdate(previousProps) {
    // Re-calculate the bounding boxes of tracked elements.
    // Compare to the bounding boxes stored in state.
    // Animate as required =)

    // If we've decided to disable animations, we don't want to run any of this!
    if ( this.animationNotRequired() ) return;

    this.parentBox = this.parentElement.getBoundingClientRect();

    // we need to make all exiting nodes "invisible" to the layout calculations
    // that will take place in the next step (this.animateTransform).
    const exitingItems = this.items.filter( ({exiting}) => exiting );
    exitingItems.forEach( exitingItem => {
      const domNode = ReactDOM.findDOMNode( this.refs[exitingItem.key] );
      domNode.style.position = 'fixed';
      console.log(domNode, domNode.style.position);
    });

    // Next, we need to do all our new layout calculations, and get our new
    // styles for each item. We'll organize it as an object where the keys
    // are the item key, and the value is their new 'style'.
    this.domStyles = this.items.reduce( (memo, item) => {
      let style = {};

      if ( this.childNeedsToBeAnimated(item) ) {
        // If the child has entered, its transition will be scale-based
        // TODO: Support presets (opacity, scaleX, scaleY)
        if ( item.entering ) {
          style.transition  = 'transform 0ms';
          style.transform   = 'scaleY(0)';
        } else if ( item.exiting ) {
          style.transition  = 'transform 0ms';
          style.transform   = 'scaleY(1)';
        } else {
          let domNode       = ReactDOM.findDOMNode( this.refs[item.key] );
          const [ dX, dY ]  = this.getPositionDelta(domNode, item.key);
          style.transition  = 'transform 0ms';
          style.transform   = `translate(${dX}px, ${dY}px)`;
        }
      }

      memo[item.key] = style;
      return memo;

    }, {});

    this.items.forEach(this.animateTransform);
  }

  animationNotRequired() {
    // If the component is explicitly passed a `disableAnimations` flag,
    // we can skip this whole process. Similarly, if all of the numbers have
    // been set to 0, there is no point in trying to animate; doing so would
    // only cause a flicker (and the intent is probably to disable animations)
    return (
      this.props.disableAnimations ||
      this.props.duration === 0 &&
      this.props.delay === 0 &&
      this.props.staggerDurationBy === 0 &&
      this.props.staggerDelayBy === 0
    )
  }

  childNeedsToBeAnimated(child) {
    // We only want to animate if the child is entering / exiting, OR:
    //  * The child has an associated key (immovable children are supported)
    //  * The child still exists in the DOM.
    //  * The child isn't brand new.
    //  * The child has moved
    //
    // Tackle the first three first, since they're very easy to determine.
    if ( !child.entering && !child.exiting ) {
      const isImmovable   = !child.key;
      const isBrandNew    = !this.boundingBoxes[child.key];
      const isDestroyed   = !this.refs[child.key];
      if ( isImmovable || isBrandNew || isDestroyed ) return;

      // Figuring out if the component has moved is a bit more work.
      const domNode       = ReactDOM.findDOMNode( this.refs[child.key] );
      const [ dX, dY ]    = this.getPositionDelta( domNode, child.key );
      const isStationary  = dX === 0 && dY === 0;

      // Stationary children don't need to be animated!
      if ( isStationary ) return;

      this.remainingAnimations++;
      this.childrenToAnimate.elements.push(child);
      this.childrenToAnimate.domNodes.push(domNode);
    }

    return true;
  }


  // THe problem is, all items are calculated sequentially.
  // If, say, the first item is being removed, it has already had its 'fixed'
  // position removed by the time the next item calculates its boundingBox.
  // The solution is to do it all as one animation.
  // Set position to fixed on all removed nodes,
  // calculate the new bounding box for all nodes,
  // trigger all animations.


  animateTransform(item, n) {
    let domNode = ReactDOM.findDOMNode( this.refs[item.key] );
    const styles = this.domStyles[item.key]


    // Apply the relevant style for this DOM node
    // Can't just do an object merge because domNode.styles is no regular object.
    // Need to do it this way for the engine to fire its `set` listeners.
    Object.keys(styles).forEach( key => {
      domNode.style[key] = styles[key];
    });

    // If this node is exiting, remove the 'position:fixed'.
    // if ( item.exiting ) {
    //   domNode.style.position = '';
    // }

    // Sadly, this is the most browser-compatible way to do this I've found.
    // Essentially we need to set the initial styles outside of any request
    // callbacks to avoid batching them. Then, a frame needs to pass with
    // the styles above rendered. Then, on the second frame, we can apply
    // our final styles to perform the animation.
    requestAnimationFrame( () => {
      requestAnimationFrame( () => {
        domNode.style.transition = this.createTransitionString(n);
        domNode.style.transform  = item.exiting ? 'scaleY(0)' : '';
      });
    });

    // Trigger the onStart callback immediately.
    if ( this.props.onStart ) this.props.onStart(item, domNode);

    // The onFinish callback needs to be bound to the transitionEnd event.
    // We also need to unbind it when the transition completes, so this ugly
    // inline function is required (we need it here so it closes over
    // dependent variables `item` and `domNode`)
    const transitionEndHandler = () => {
      // Remove the 'transition' inline style we added. This is cleanup.
      domNode.style.transition = '';

      // Trigger any applicable onFinish/onFinishAll hooks
      this.triggerFinishHooks(item, domNode);

      domNode.removeEventListener(transitionEnd, transitionEndHandler)
    };
    domNode.addEventListener(transitionEnd, transitionEndHandler);
  }


  getPositionDelta(domNode, key) {
    const newBox  = domNode.getBoundingClientRect();
    const oldBox  = this.boundingBoxes[key];
    const relativeBox = {
      top:  newBox.top - this.parentBox.top,
      left: newBox.left - this.parentBox.left
    };

    return [
      oldBox.left - relativeBox.left,
      oldBox.top  - relativeBox.top
    ];
  }

  createTransitionString(n) {
    let { duration, staggerDurationBy, delay, staggerDelayBy, easing } = this.props;

    delay     += n * staggerDelayBy;
    duration  += n * staggerDurationBy;

    return `transform ${duration}ms ${easing} ${delay}ms`;
  }


  triggerFinishHooks(child, domNode) {
    if ( this.props.onFinish ) this.props.onFinish(child, domNode);

    // Reduce the number of children we need to animate by 1,
    // so that we can tell when all children have finished.
    this.remainingAnimations--;

    if ( this.remainingAnimations === 0 ) {
      try {
        if ( typeof this.props.onFinishAll === 'function' ) {
          this.props.onFinishAll(
            this.childrenToAnimate.elements, this.childrenToAnimate.domNodes
          );
        }
      } finally {
        // Reset our variables for the next iteration
        this.childrenToAnimate.elements = [];
        this.childrenToAnimate.domNodes = [];

        // TODO: Cleanup! Remove exited items from the DOM, and set all
        // `entering` flags to false.
      }
    }
  }

  childrenWithRefs() {
    return this.items.map( child => {
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
