// @flow
import type { Element } from 'react';
import type {
  Styles,
  Animation,
  Presets,
  AnimationProp,
  ClientRect,
  ElementShape,
  ChildrenHook,
  GetPosition,
  VerticalAlignment,
  FlipMoveDefaultProps,
  Hooks,
  DelegatedProps,
  FlipMoveProps,
} from 'react-flip-move'; // eslint-disable-line import/extensions

export type {
  Styles,
  Animation,
  Presets,
  AnimationProp,
  ClientRect,
  ElementShape,
  ChildrenHook,
  GetPosition,
  VerticalAlignment,
  FlipMoveDefaultProps,
  Hooks,
  DelegatedProps,
  FlipMoveProps,
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

export type ChildData = ElementShape & {
  element: Element<*>,
  appearing?: boolean,
  entering?: boolean,
  leaving?: boolean,
};

export type FlipMoveState = {
  children: Array<ChildData>,
};

export type NodeData = {
  domNode?: ?HTMLElement,
  boundingBox?: ?ClientRect,
};
