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

import './polyfills';
import propConverter from './prop-converter';
import {
  whichTransitionEvent, filterNewItems, applyStylesToDOMNode
} from './helpers.js';

const transitionEnd = whichTransitionEvent();


@propConverter
class FlipMove extends Component {
  constructor(props) {
    super(props);
    this.boundingBoxes = {};

    this.parentElement  = null;
    this.parentBox      = null;

    this.doesChildNeedToBeAnimated  = this.doesChildNeedToBeAnimated.bind(this);

    // Copy props.children into state.
    // To understand why this is important (and not an anti-pattern), consider
    // how "leave" animations work. An item has "left" when the component
    // receives a new set of props that do NOT contain the item.
    // If we just render the props as-is, the item would instantly disappear.
    // We want to keep the item rendered for a little while, until its animation
    // can complete. Because we cannot mutate props, we make `state` the source
    // of truth.
    this.state = { children: props.children };

    // Keep track of remaining animations so we know when to fire the
    // all-finished callback, and clean up after ourselves.
    this.remainingAnimations = 0;
    this.childrenToAnimate   = {
      elements: [],
      domNodes: []
    };

    // When leaving items, we apply some over-ride styles to them (position,
    // top, left). If the item is passed in through props BEFORE the item has
    // finished leaving, its style will be wrong. So, to prevent any weirdness,
    // we store the "original" styles here so they can be applied on re-entry.
    // A crazy edge case, I know.
    this.originalDomStyles = {};
  }


  componentDidMount() {
    this.parentElement = ReactDOM.findDOMNode(this);
  }


  componentDidUpdate(previousProps) {
    // If the children have been re-arranged, moved, or added/removed,
    // trigger the main FLIP animation.
    //
    // This check is required so that we don't trigger a re-animation when the
    // `onFinishAll` handler is called, at the end of the animation, to remove
    // exited nodes.
    if ( this.props.children !== previousProps.children ) {
      this.calculateAndAnimateChildren();
    }
  }


  componentWillReceiveProps(nextProps) {
    // When the component is handed new props, we need to figure out the "resting"
    // position of all currently-rendered DOM nodes. We store that data in
    // this.boundingBoxes, so it can be used later to work out the animation.

    // Calculate the parentBox. This is used to find childBoxes relative
    // to the parent container, not the viewport.
    const parentBox = this.parentElement.getBoundingClientRect();

    // Get the bounding boxes of all currently-rendered, keyed children.
    const newBoundingBoxes = this.props.children.reduce( (boxes, child) => {
      // It is possible that a child does not have a `key` property;
      // Ignore these children, they don't need to be moved.
      if ( !child.key ) return boxes;

      const domNode     = ReactDOM.findDOMNode( this.refs[child.key] );

      const childBox    = domNode.getBoundingClientRect();
      const relativeBox = {
        'top':    childBox['top']  - parentBox['top'],
        'left':   childBox['left'] - parentBox['left'],
        'right':  parentBox['right'] - childBox['right'],
        'bottom': parentBox['bottom'] - childBox['bottom']
      };

      return { ...boxes, [child.key]: relativeBox };
    }, {});

    this.boundingBoxes = {
      ...this.boundingBoxes,
      ...newBoundingBoxes
    };

    // Create our custom list of items.
    // We use this list instead of props so that we can mutate it.
    // We're keeping just-deleted nodes for a bit longer, as well as adding a
    // flag to just-created nodes, so we know they need to be entered.
    this.setState({
      children: this.prepareNextChildren(nextProps.children)
    });
  }


  prepareNextChildren(nextChildren) {
    // We want to:
    //   - Mark all new children as `entering`
    //   - Pull in previous children that aren't in nextChildren, and mark them
    //     as `leaving`
    //   - Preserve the nextChildren list order, with leaving children in their
    //     appropriate places.
    //

    // Start by marking new children as 'entering'
    let updatedChildren = nextChildren.map( nextChild => {
      const child = this.state.children.find( ({key}) => key === nextChild.key );

      // If the current child did exist, but it was in the middle of leaving,
      // we want to treat it as though it's entering
      const isEntering = !child || child.leaving;

      return { ...nextChild, entering: isEntering };
    });

    // This is tricky. We want to keep the nextChildren's ordering, but with
    // any just-removed items maintaining their original position.
    // eg.
    //   this.state.children  = [ 1, 2, 3, 4 ]
    //   nextChildren         = [ 3, 1 ]
    //
    // In this example, we've removed the '2' & '4'
    // We want to end up with:  [ 2, 3, 1, 4 ]
    //
    // To accomplish that, we'll iterate through this.state.children. whenever
    // we find a match, we'll append our `leaving` flag to it, and insert it
    // into the nextChildren in its ORIGINAL position. Note that, as we keep
    // inserting old items into the new list, the "original" position will
    // keep incrementing.
    let numOfChildrenLeaving = 0;
    this.state.children.forEach( (child, index) => {
      const isLeaving = !nextChildren.find( ({key}) => key === child.key );

      // If the child isn't leaving (or, if there is no leave animation),
      // we don't need to add it into the state children.
      if ( !isLeaving || !this.props.leaveAnimation ) return;

      let nextChild = { ...child, leaving: true };
      let nextChildIndex = index + numOfChildrenLeaving;

      updatedChildren.splice(nextChildIndex, 0, nextChild);
      numOfChildrenLeaving++;
    });

    return updatedChildren;
  }


  calculateAndAnimateChildren() {
    // Re-calculate the bounding boxes of tracked elements.
    // Compare to the bounding boxes stored in state.
    // Animate as required =)

    // If we've decided to disable animations, we don't want to run any of this!
    if ( this.isAnimationDisabled() ) return;

    this.parentBox = this.parentElement.getBoundingClientRect();

    // we need to make all leaving nodes "invisible" to the layout calculations
    // that will take place in the next step (this.runAnimation).
    if ( this.props.leaveAnimation ) {
      const leavingChildren = this.state.children.filter( ({leaving}) => leaving );

      leavingChildren.forEach( leavingChild => {
        const domNode = ReactDOM.findDOMNode( this.refs[leavingChild.key] );
        const leavingBoundingBox = this.boundingBoxes[leavingChild.key];

        // We need to take the items out of the "flow" of the document, so that
        // its siblings can move to take its place.
        // By setting its position to absolute and positioning it where it is,
        // we can make it leave in-place while its siblings can calculate where
        // they need to go.
        // If, however, the 'leave' is interrupted and they're forced to re-enter,
        // we want to undo this change, and the only way to do that is to preserve
        // their current styles.
        this.originalDomStyles[leavingChild.key] = {
          position: domNode.style.position,
          top:      domNode.style.top,
          left:     domNode.style.left,
          right:    domNode.style.right
        };

        // For this to work, we have to offset any given `margin`.
        let computed = window.getComputedStyle(domNode);
        let cleanedComputed = {};

        // Clean up the properties (remove 'px', convert to Number).
        ['margin-top', 'margin-left', 'margin-right'].forEach( margin => {
          const propertyVal = computed.getPropertyValue(margin);
          cleanedComputed[margin] = Number( propertyVal.replace('px', '') );
        });

        domNode.style.position  = 'absolute';
        domNode.style.top   = leavingBoundingBox.top - cleanedComputed['margin-top'] + 'px';
        domNode.style.left  = leavingBoundingBox.left - cleanedComputed['margin-left'] + 'px';
        domNode.style.right = leavingBoundingBox.right - cleanedComputed['margin-right'] + 'px';
      });
    }

    const dynamicChildren = this.state.children.filter(
      this.doesChildNeedToBeAnimated
    );

    // Next, we need to do all our new layout calculations, and get our new
    // styles for each item. We'll organize it as an object where the keys
    // are the item key, and the value is their new 'style'.
    this.domStyles = dynamicChildren.reduce( (memo, child) => {
      memo[child.key] = this.computeInitialStyles(child);
      return memo;
    }, {});

    // Now that the styles are computed, animate each child individually.
    dynamicChildren.forEach( (child, index) => {
      this.addChildToAnimationsList(child);
      this.runAnimation(child, index);
    });
  }


  computeInitialStyles(child) {
    let style = { transition: '0ms' };

    if ( child.entering ) {
      if ( this.props.enterAnimation ) {
        let original = this.originalDomStyles[child.key] || {};
        style = {
          ...style,
          ...this.props.enterAnimation.from,
          ...original
        };
      }
    } else if ( child.leaving ) {
      if ( this.props.leaveAnimation ) {
        style = {
          ...style,
          ...this.props.leaveAnimation.from
        };
      }
    } else {
      let domNode       = ReactDOM.findDOMNode( this.refs[child.key] );
      const [ dX, dY ]  = this.getPositionDelta(domNode, child.key);
      style.transform   = `translate(${dX}px, ${dY}px)`;
    }

    return style;
  }


  isAnimationDisabled() {
    // If the component is explicitly passed a `disableAllAnimations` flag,
    // we can skip this whole process. Similarly, if all of the numbers have
    // been set to 0, there is no point in trying to animate; doing so would
    // only cause a flicker (and the intent is probably to disable animations)
    return (
      this.props.disableAllAnimations ||
      (
        this.props.duration === 0 &&
        this.props.delay === 0 &&
        this.props.staggerDurationBy === 0 &&
        this.props.staggerDelayBy === 0
      )
    );
  }


  doesChildNeedToBeAnimated(child) {
    // If the child doesn't have a key, it's an immovable child (one that we
    // do not want to do flip stuff to.)
    if ( !child.key ) return;

    if (
      ( child.entering && this.props.enterAnimation ) ||
      ( child.leaving  && this.props.leaveAnimation )
    ) {
      return true;
    }

    // Otherwise, we only want to animate it if the child's position on-screen
    // has changed. Let's figure that out.
    const domNode     = ReactDOM.findDOMNode( this.refs[child.key] );
    const [ dX, dY ]  = this.getPositionDelta( domNode, child.key );

    return dX !== 0 || dY !== 0;
  }


  addChildToAnimationsList(child) {
    // Add this child to the animations array. This is used for working out
    // when all children have finished animated (so that the onFinishAll
    // callback can be fired, and so we can do some cleanup).
    const domNode = ReactDOM.findDOMNode( this.refs[child.key] );

    this.remainingAnimations++;
    this.childrenToAnimate.elements.push(child);
    this.childrenToAnimate.domNodes.push(domNode);
  }


  runAnimation(child, n) {
    let domNode = ReactDOM.findDOMNode( this.refs[child.key] );
    const styles = this.domStyles[child.key];

    // Apply the relevant style for this DOM node
    // This is the offset from its actual DOM position.
    // eg. if an item has been re-rendered 20px lower, we want to apply a
    // style of 'transform: translate(-20px)', so that it appears to be where
    // it started.
    applyStylesToDOMNode(domNode, styles);

    //// A note on the double-requestAnimationFrame:
    //// Sadly, this is the most browser-compatible way to do this I've found.
    //// Essentially we need to set the initial styles outside of any request
    //// callbacks to avoid batching them. Then, a frame needs to pass with
    //// the styles above rendered. Then, on the second frame, we can apply
    //// our final styles to perform the animation.
    requestAnimationFrame( () => {
      requestAnimationFrame( () => {
        // Our first order of business is to "undo" the styles applied in the
        // previous frames, while also adding a `transition` property.
        // This way, the item will smoothly transition from its old position
        // to its new position.
        let styles = {
          transition: this.createTransitionString(n),
          transform: '',
          opacity: ''
        };

        if ( child.entering && this.props.enterAnimation ) {
          styles = {
            ...styles,
            ...this.props.enterAnimation.to
          };
        } else if ( child.leaving && this.props.leaveAnimation ) {
          styles = {
            ...styles,
            ...this.props.leaveAnimation.to
          };
        }

        applyStylesToDOMNode(domNode, styles);
      });
    });

    // Trigger the onStart callback immediately.
    if ( this.props.onStart ) this.props.onStart(child, domNode);

    // The onFinish callback needs to be bound to the transitionEnd event.
    // We also need to unbind it when the transition completes, so this ugly
    // inline function is required (we need it here so it closes over
    // dependent variables `child` and `domNode`)
    const transitionEndHandler = (ev) => {
      // It's possible that this handler is fired not on our primary transition,
      // but on a nested transition (eg. a hover effect). Ignore these cases.
      if ( ev.srcElement !== domNode ) return;

      // Remove the 'transition' inline style we added. This is cleanup.
      domNode.style.transition = '';

      // Trigger any applicable onFinish/onFinishAll hooks
      this.triggerFinishHooks(child, domNode);

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


  createTransitionString(n, props=['transform', 'opacity']) {
    let { duration, staggerDurationBy, delay, staggerDelayBy, easing } = this.props;

    delay     += n * staggerDelayBy;
    duration  += n * staggerDurationBy;

    return props
      .map( prop => `${prop} ${duration}ms ${easing} ${delay}ms`)
      .join(', ');
  }


  triggerFinishHooks(child, domNode) {
    if ( this.props.onFinish ) this.props.onFinish(child, domNode);

    // Reduce the number of children we need to animate by 1,
    // so that we can tell when all children have finished.
    this.remainingAnimations--;

    if ( this.remainingAnimations === 0 ) {
      // Reset our variables for the next iteration
      this.childrenToAnimate.elements = [];
      this.childrenToAnimate.domNodes = [];

      // Remove any items from the DOM that have left, and reset `entering`.
      const nextChildren = this.state.children
        .filter( ({leaving}) => !leaving )
        .map( item => {
          item.entering = false;
          return item;
        });

      this.originalDomStyles = {}

      this.setState({ children: nextChildren }, () => {
        if ( typeof this.props.onFinishAll === 'function' ) {
          this.props.onFinishAll(
            this.childrenToAnimate.elements, this.childrenToAnimate.domNodes
          );
        }
      });
    }
  }


  childrenWithRefs() {
    return this.state.children.map( child => {
      return React.cloneElement(child, { ref: child.key });
    });
  }


  render() {
    return React.createElement(
      this.props.typeName,
      {
        className: this.props.className,
        style: {
          position: 'relative',
          ...this.props.style
        }
      },
      this.childrenWithRefs()
    );
  }
}



export default FlipMove;
