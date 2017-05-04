// @flow
import type { Element } from 'react';

export type Animation = {
  from: Object,
  to: Object,
};

export type Presets = {
  elevator: Animation,
  fade: Animation,
  accordionVertical: Animation,
  accordionHorizontal: Animation,
  none: null,
};

export type AnimationProp = $Keys<Presets> | boolean | Animation;

export type ClientRect = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  height: number,
  width: number,
};

type ChildHook = (Element<*>, ?HTMLElement) => mixed;

export type ChildrenHook = (Element<*>[], Array<?HTMLElement>) => mixed;

// this one cannot use intersection, see https://github.com/facebook/flow/issues/2904
export type FlipMoveDefaultProps = {
  easing: string,
  duration: string | number,
  delay: string | number,
  staggerDurationBy: string | number,
  staggerDelayBy: string | number,
  typeName: string,
  enterAnimation: AnimationProp,
  leaveAnimation: AnimationProp,
  disableAllAnimations: boolean,
  getPosition: (HTMLElement) => ClientRect,
  maintainContainerHeight: boolean,
  verticalAlignment: 'top' | 'bottom',
};

type Hooks = {
  onStart?: ChildHook,
  onFinish?: ChildHook,
  onStartAll?: ChildrenHook,
  onFinishAll?: ChildrenHook,
};

export type FlipMoveProps = FlipMoveDefaultProps & Hooks & {
  children?: mixed,
  appearAnimation?: AnimationProp,
  disableAnimations?: boolean, // deprecated, use disableAllAnimations instead
};

export type ConvertedProps = Hooks & {
  children: Element<*>[],
  easing: string,
  duration: number,
  delay: number,
  staggerDurationBy: number,
  staggerDelayBy: number,
  typeName: string,
  appearAnimation: ?Animation,
  enterAnimation: ?Animation,
  leaveAnimation: ?Animation,
  disableAllAnimations: boolean,
  getPosition: (HTMLElement) => ClientRect,
  maintainContainerHeight: boolean,
  verticalAlignment: 'top' | 'bottom',
  delegated: Object,
};

export type ChildData = {
  element: Element<*>,
  appearing?: boolean,
  entering?: boolean,
  leaving?: boolean,
};

export type FlipMoveState = {
  children: ChildData[],
};

export type NodeData = {
  domNode?: ?HTMLElement,
  boundingBox?: ?ClientRect,
};
