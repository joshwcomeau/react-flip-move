// @flow
import type { Element } from 'react';

export type Styles = {
  [string]: string | number,
};

export type Animation = {
  from: Styles,
  to: Styles,
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

export type GetPosition = (HTMLElement) => ClientRect;

export type VerticalAlignment = 'top' | 'bottom';

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
  getPosition: GetPosition,
  maintainContainerHeight: boolean,
  verticalAlignment: VerticalAlignment,
};

type Hooks = {
  onStart?: ChildHook,
  onFinish?: ChildHook,
  onStartAll?: ChildrenHook,
  onFinishAll?: ChildrenHook,
};

export type DelegatedProps = {
  style?: Styles,
};

export type FlipMoveProps = FlipMoveDefaultProps & Hooks & DelegatedProps & {
  children?: mixed,
  appearAnimation?: AnimationProp,
  disableAnimations?: boolean, // deprecated, use disableAllAnimations instead
};

export type ConvertedProps = Hooks & {
  children: mixed,
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
  getPosition: GetPosition,
  maintainContainerHeight: boolean,
  verticalAlignment: VerticalAlignment,
  delegated: DelegatedProps,
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
