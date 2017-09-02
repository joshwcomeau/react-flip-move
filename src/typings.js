// @flow
import type { Element } from 'react';
import type {
  Child,
  Styles,
  Animation,
  Presets,
  AnimationProp,
  ClientRect,
  ElementShape,
  ChildrenHook,
  GetPosition,
  VerticalAlignment,
  CommonProps,
  DelegatedProps,
  FlipMoveProps,
} from 'react-flip-move'; // eslint-disable-line import/extensions

export type {
  Child,
  Styles,
  Animation,
  Presets,
  AnimationProp,
  ClientRect,
  ElementShape,
  ChildrenHook,
  GetPosition,
  VerticalAlignment,
  CommonProps,
  DelegatedProps,
  FlipMoveProps,
};

export type ConvertedProps = CommonProps & {
  duration: number,
  delay: number,
  staggerDurationBy: number,
  staggerDelayBy: number,
  appearAnimation: ?Animation,
  enterAnimation: ?Animation,
  leaveAnimation: ?Animation,
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
