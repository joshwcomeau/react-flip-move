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

export type FlipMoveProps = {
  children?: mixed,
  easing: string,
  duration: string | number,
  delay: string | number,
  staggerDurationBy: string | number,
  staggerDelayBy: string | number,
  onStart?: ChildHook,
  onFinish?: ChildHook,
  onStartAll?: ChildrenHook,
  onFinishAll?: ChildrenHook,
  typeName: string,
  appearAnimation?: AnimationProp,
  enterAnimation: AnimationProp,
  leaveAnimation: AnimationProp,
  disableAnimations?: boolean, // deprecated, use disableAllAnimations instead
  disableAllAnimations: boolean,
  getPosition: (HTMLElement) => ClientRect,
  maintainContainerHeight: boolean,
  verticalAlignment: 'top' | 'bottom',
};

export type ConvertedProps = {
  children: Element<*>[],
  easing: string,
  duration: number,
  delay: number,
  staggerDurationBy: number,
  staggerDelayBy: number,
  onStart?: ChildHook,
  onFinish?: ChildHook,
  onStartAll?: ChildrenHook,
  onFinishAll?: ChildrenHook,
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
