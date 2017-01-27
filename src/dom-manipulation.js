/**
 * React Flip Move
 * (c) 2016-present Joshua Comeau
 *
 * These methods read from and write to the DOM.
 * They almost always have side effects, and will hopefully become the
 * only spot in the codebase with impure functions.
 */
import { findDOMNode } from 'react-dom';


export function applyStylesToDOMNode({ domNode, styles }) {
  // Can't just do an object merge because domNode.styles is no regular object.
  // Need to do it this way for the engine to fire its `set` listeners.
  Object.keys(styles).forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    domNode.style[key] = styles[key];
  });
}


// Modified from Modernizr
export function whichTransitionEvent() {
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  };

  // If we're running in a browserless environment (eg. SSR), it doesn't apply.
  // Return a placeholder string, for consistent type return.
  if (typeof document === 'undefined') return '';

  const el = document.createElement('fakeelement');

  const match = Object.keys(transitions).find(t => (
    el.style[t] !== undefined
  ));

  // If no `transition` is found, we must be running in a browser so ancient,
  // React itself won't run. Return an empty string, for consistent type return
  return match ? transitions[match] : '';
}


export const getRelativeBoundingBox = ({
  childData,
  parentData,
  getPosition,
}) => {
  const { domNode: childDomNode } = childData;
  const { domNode: parentDomNode } = parentData;

  const parentBox = getPosition(parentDomNode);
  const { top, left, right, bottom, width, height } = getPosition(childDomNode);

  return {
    top: top - parentBox.top,
    left: left - parentBox.left,
    right: parentBox.right - right,
    bottom: parentBox.bottom - bottom,
    width,
    height,
  };
};


/** getPositionDelta
 * This method returns the delta between two bounding boxes, to figure out
 * how mant pixels on each axis the element has moved.
 *
 * @param {Object} childData - needs shape { domNode, boundingBox }
 * @param {Object} parentData - needs shape { domNode, boundingBox }
 * @param {Function} getPosition - the function called to get bounding boxes
 * for a DOM node. Defaults to `getBoundingClientRect`.
 *
 * @returns [{Number: left}, {Number: top}]
 */
export const getPositionDelta = ({
  childData,
  parentData,
  getPosition,
}) => {
  // TEMP: A mystery bug is sometimes causing unnecessary boundingBoxes to
  // remain. Until this bug can be solved, this band-aid fix does the job:
  const defaultBox = { top: 0, left: 0, right: 0, bottom: 0 };

  // Our old box is its last calculated position, derived on mount or at the
  // start of the previous animation.
  const oldRelativeBox = childData.boundingBox || defaultBox;

  // Our new box is the new final resting place: Where we expect it to wind up
  // after the animation. First we get the box in absolute terms (AKA relative
  // to the viewport), and then we calculate its relative box (relative to the
  // parent container)
  const newAbsoluteBox = getPosition(childData.domNode);
  const newRelativeBox = {
    top: newAbsoluteBox.top - parentData.boundingBox.top,
    left: newAbsoluteBox.left - parentData.boundingBox.left,
  };

  return [
    oldRelativeBox.left - newRelativeBox.left,
    oldRelativeBox.top - newRelativeBox.top,
  ];
};


/** removeNodeFromDOMFlow
 * This method does something very sneaky: it removes a DOM node from the
 * document flow, but without actually changing its on-screen position.
 *
 * It works by calculating where the node is, and then applying styles
 * so that it winds up being positioned absolutely, but in exactly the
 * same place.
 *
 * This is a vital part of the FLIP technique.
 *
 * @param {Object} domNode - the node we'll be working with
 * @param {Object} boundingBox - the node's starting position.
 *
 * @returns null
 */
export const removeNodeFromDOMFlow = (childData, verticalAlignment) => {
  const { domNode, boundingBox } = childData;

  // For this to work, we have to offset any given `margin`.
  const computed = window.getComputedStyle(domNode);

  // We need to clean up margins, by converting and removing suffix:
  // eg. '21px' -> 21
  const marginAttrs = ['margin-top', 'margin-left', 'margin-right'];
  const margins = marginAttrs.reduce((acc, margin) => {
    const propertyVal = computed.getPropertyValue(margin);

    return {
      ...acc,
      [margin]: Number(propertyVal.replace('px', '')),
    };
  }, {});

  // If we're bottom-aligned, we need to add the height of the child to its
  // top offset. This is because, when the container is bottom-aligned, its
  // height shrinks from the top, not the bottom. We're removing this node
  // from the flow, so the top is going to drop by its height.
  const topOffset = verticalAlignment === 'bottom'
    ? boundingBox.top - boundingBox.height
    : boundingBox.top;

  const styles = {
    position: 'absolute',
    top: `${topOffset - margins['margin-top']}px`,
    left: `${boundingBox.left - margins['margin-left']}px`,
    right: `${boundingBox.right - margins['margin-right']}px`,
  };

  applyStylesToDOMNode({ domNode, styles });
};

/** updateHeightPlaceholder
 * An optional property to FlipMove is a `maintainContainerHeight` boolean.
 * This property creates a node that fills space, so that the parent
 * container doesn't collapse when its children are removed from the
 * document flow.
 *
 * @param {Object} domNode - the node we'll be working with
 * @param {Object} parentData - needs shape { domNode, boundingBox }
 * @param {Function} getPosition - the function called to get bounding boxes
 * for a DOM node. Defaults to `getBoundingClientRect`.
 *
 * @returns null
 */
export const updateHeightPlaceholder = ({
  domNode,
  parentData,
  getPosition,
}) => {
  // We need to find the height of the container *without* the placeholder.
  // Since it's possible that the placeholder might already be present,
  // we first set its height to 0.
  // This allows the container to collapse down to the size of just its
  // content (plus container padding or borders if any).
  applyStylesToDOMNode({ domNode, styles: { height: 0 } });

  // Find the distance by which the container would be collapsed by elements
  // leaving. We compare the freshly-available parent height with the original,
  // cached container height.
  const originalParentHeight = parentData.boundingBox.height;
  const collapsedParentHeight = getPosition(parentData.domNode).height;
  const reductionInHeight = originalParentHeight - collapsedParentHeight;

  // If the container has become shorter, update the padding element's
  // height to take up the difference. Otherwise set its height to zero,
  // so that it has no effect.
  const styles = {
    height: reductionInHeight > 0 ? `${reductionInHeight}px` : 0,
  };

  applyStylesToDOMNode({ domNode, styles });
};

export const getNativeNode = (element) => {
  // When running in a windowless environment, abort!
  if (typeof HTMLElement === 'undefined') {
    return null;
  }

  // `element` may already be a native node.
  if (element instanceof HTMLElement) {
    return element;
  }

  // While ReactDOM's `findDOMNode` is discouraged, it's the only
  // publicly-exposed way to find the underlying DOM node for
  // composite components.
  return findDOMNode(element);
};

export const createTransitionString = (index, props) => {
  let { delay, duration } = props;
  const { staggerDurationBy, staggerDelayBy, easing } = props;

  delay += index * staggerDelayBy;
  duration += index * staggerDurationBy;

  const cssProperties = ['transform', 'opacity'];

  return cssProperties
    .map(prop => `${prop} ${duration}ms ${easing} ${delay}ms`)
    .join(', ');
};
