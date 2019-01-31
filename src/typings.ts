import { ReactElement, Ref, ReactChild } from 'react';

export type Styles = {
  [key: string]: string,
};

type ReactStyles = {
  [key: string]: string | number,
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

export type AnimationProp = keyof Presets | boolean | Animation;

export type ClientRect = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  height: number,
  width: number,
};

// can't use $Shape<React$Element<*>> here, because we use it in intersection
export type ElementShape = {
  type: ReactElement<any>['type'],
  props: ReactElement<any>['props'],
  key: ReactElement<any>['key'],
  ref: Ref<any>,
};

type ChildHook = (element: ElementShape, node: HTMLElement) => any;

export type ChildrenHook = (
  elements: Array<ElementShape>,
  nodes: Array<HTMLElement>,
) => any;

export type GetPosition = (node: HTMLElement) => ClientRect;

export type VerticalAlignment = 'top' | 'bottom';

export type Child = void | null | boolean | ReactElement<any>;

// // can't import from React, see https://github.com/facebook/flow/issues/4787
type ChildrenArray<T> = Array<ReactChild>;

type BaseProps = {
  easing: string,
  typeName: string,
  disableAllAnimations: boolean,
  getPosition: GetPosition,
  maintainContainerHeight: boolean,
  verticalAlignment: VerticalAlignment,
  createTransitionString: (index: number) => string,
};

type PolymorphicProps = {
  duration: string | number,
  delay: string | number,
  staggerDurationBy: string | number,
  staggerDelayBy: string | number,
  enterAnimation: AnimationProp,
  leaveAnimation: AnimationProp,
};

type Hooks = {
  onStart?: ChildHook,
  onFinish?: ChildHook,
  onStartAll?: ChildrenHook,
  onFinishAll?: ChildrenHook,
};

export type DelegatedProps = {
  style?: ReactStyles,
};

export type FlipMoveDefaultProps = BaseProps & PolymorphicProps;

export type CommonProps = BaseProps &
  Hooks & {
    children?: ChildrenArray<Child>,
  };

export type FlipMoveProps = FlipMoveDefaultProps &
  CommonProps &
  DelegatedProps & {
    appearAnimation?: AnimationProp,
    disableAnimations?: boolean, // deprecated, use disableAllAnimations instead
  };

export type ConvertedProps = CommonProps & {
  duration: number,
  delay: number,
  staggerDurationBy: number,
  staggerDelayBy: number,
  appearAnimation?: Animation,
  enterAnimation?: Animation,
  leaveAnimation?: Animation,
  // customAnimation?: Animation,
  // customAnimationKeys?: string[],
  delegated: DelegatedProps,
};

export type ChildData = ElementShape & {
  element: ReactElement<any>,
  appearing?: boolean,
  entering?: boolean,
  leaving?: boolean,
};

export type FlipMoveState = {
  children: Array<ChildData>,
};

export type NodeData = {
  domNode?: HTMLElement,
  boundingBox?: ClientRect,
};
