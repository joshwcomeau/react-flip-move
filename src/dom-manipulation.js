// @flow
/**
 * React Flip Move
 * (c) 2016-present Joshua Comeau
 *
 * These methods read from and write to the DOM.
 * They almost always have side effects, and will hopefully become the
 * only spot in the codebase with impure functions.
 */
import { findDOMNode } from 'react-dom';
import type { Component } from 'react';

import { hyphenate } from './helpers';
import type {
  Styles,
  ClientRect,
  GetPosition,
  NodeData,
  VerticalAlignment,
  ConvertedProps,
} from './typings';

export function applyStylesToDOMNode({ domNode, styles }: {
  domNode: HTMLElement,
  styles: Styles,
}) {
  // Can't just do an object merge because domNode.styles is no regular object.
  // Need to do it this way for the engine to fire its `set` listeners.
  Object.keys(styles).forEach((key) => {
    domNode.style.setProperty(hyphenate(key), styles[key]);
  });
}


// Modified from Modernizr
export function whichTransitionEvent(): string {
  const transitions = {
    transition: 'transitionend',
    '-o-transition': 'oTransitionEnd',
    '-moz-transition': 'transitionend',
    '-webkit-transition': 'webkitTransitionEnd',
  };

  // If we're running in a browserless environment (eg. SSR), it doesn't apply.
  // Return a placeholder string, for consistent type return.
  if (typeof document === 'undefined') return '';

  const el = document.createElement('fakeelement');

  const match = Object.keys(transitions).find(t => (
    el.style.getPropertyValue(t) !== undefined
  ));

  // If no `transition` is found, we must be running in a browser so ancient,
  // React itself won't run. Return an empty string, for consistent type return
  return match ? transitions[match] : '';
}


export const getRelativeBoundingBox = ({
  childDomNode,
  parentDomNode,
  getPosition,
}: {
  childDomNode: HTMLElement,
  parentDomNode: HTMLElement,
  getPosition: GetPosition,
}): ClientRect => {
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
 * how many pixels on each axis the element has moved.
 *
 */
export const getPositionDelta = ({
  childDomNode,
  childBoundingBox,
  parentBoundingBox,
  getPosition,
}: {
  childDomNode: HTMLElement,
  childBoundingBox: ?ClientRect,
  parentBoundingBox: ?ClientRect,
  getPosition: GetPosition,
}): [number, number] => {
  // TEMP: A mystery bug is sometimes causing unnecessary boundingBoxes to
  // remain. Until this bug can be solved, this band-aid fix does the job:
  const defaultBox: ClientRect = { top: 0, left: 0, right: 0, bottom: 0, height: 0, width: 0 };

  // Our old box is its last calculated position, derived on mount or at the
  // start of the previous animation.
  const oldRelativeBox = childBoundingBox || defaultBox;
  const parentBox = parentBoundingBox || defaultBox;

  // Our new box is the new final resting place: Where we expect it to wind up
  // after the animation. First we get the box in absolute terms (AKA relative
  // to the viewport), and then we calculate its relative box (relative to the
  // parent container)
  const newAbsoluteBox = getPosition(childDomNode);
  const newRelativeBox = {
    top: newAbsoluteBox.top - parentBox.top,
    left: newAbsoluteBox.left - parentBox.left,
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
 */
export const removeNodeFromDOMFlow = (
  childData: NodeData,
  verticalAlignment: VerticalAlignment
) => {
  const { domNode, boundingBox } = childData;

  if (!domNode || !boundingBox) {
    return;
  }

  // For this to work, we have to offset any given `margin`.
  const computed: CSSStyleDeclaration = window.getComputedStyle(domNode);

  // We need to clean up margins, by converting and removing suffix:
  // eg. '21px' -> 21
  const marginAttrs = ['margin-top', 'margin-left', 'margin-right'];
  const margins: {
    [string]: number,
  } = marginAttrs.reduce((acc, margin) => {
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

  const styles: Styles = {
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
 */
export const updateHeightPlaceholder = ({
  domNode,
  parentData,
  getPosition,
}: {
  domNode: HTMLElement,
  parentData: NodeData,
  getPosition: GetPosition,
}) => {
  const parentDomNode = parentData.domNode;
  const parentBoundingBox = parentData.boundingBox;

  if (!parentDomNode || !parentBoundingBox) {
    return;
  }

  // We need to find the height of the container *without* the placeholder.
  // Since it's possible that the placeholder might already be present,
  // we first set its height to 0.
  // This allows the container to collapse down to the size of just its
  // content (plus container padding or borders if any).
  applyStylesToDOMNode({ domNode, styles: { height: '0' } });

  // Find the distance by which the container would be collapsed by elements
  // leaving. We compare the freshly-available parent height with the original,
  // cached container height.
  const originalParentHeight = parentBoundingBox.height;
  const collapsedParentHeight = getPosition(parentDomNode).height;
  const reductionInHeight = originalParentHeight - collapsedParentHeight;

  // If the container has become shorter, update the padding element's
  // height to take up the difference. Otherwise set its height to zero,
  // so that it has no effect.
  const styles: Styles = {
    height: reductionInHeight > 0 ? `${reductionInHeight}px` : '0',
  };

  applyStylesToDOMNode({ domNode, styles });
};

export const getNativeNode = (element: HTMLElement | Component<*, *, *>): ?HTMLElement => {
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
  const foundNode: ?(Element | Text) = findDOMNode(element);

  if (!(foundNode instanceof HTMLElement)) {
    // Text nodes are not supported
    return null;
  }

  return foundNode;
};

export const createTransitionString = (index: number, props: ConvertedProps): string => {
  let { delay, duration } = props;
  const { staggerDurationBy, staggerDelayBy, easing } = props;

  delay += index * staggerDelayBy;
  duration += index * staggerDurationBy;

  const cssProperties = ['transform', 'opacity'];

  return cssProperties
    .map(prop => `${prop} ${duration}ms ${easing} ${delay}ms`)
    .join(', ');
};
