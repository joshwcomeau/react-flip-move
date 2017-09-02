import type { ComponentType, Element, Node } from 'react';

declare module 'react-flip-move' {
  declare export type Styles = {
    [key: string]: string,
  };

  declare type ReactStyles = {
    [key: string]: string | number,
  };

  declare export type Animation = {
    from: Styles,
    to: Styles,
  };

  declare export type Presets = {
    elevator: Animation,
    fade: Animation,
    accordionVertical: Animation,
    accordionHorizontal: Animation,
    none: null,
  };

  declare export type AnimationProp = $Keys<Presets> | boolean | Animation;

  declare export type ClientRect = {
    top: number,
    right: number,
    bottom: number,
    left: number,
    height: number,
    width: number,
  };

  // can't use $Shape<React$Element<*>> here, because we use it in intersection
  declare export type ElementShape = {
    type: $PropertyType<Element<*>, 'type'>,
    props: $PropertyType<Element<*>, 'props'>,
    key: $PropertyType<Element<*>, 'key'>,
    ref: $PropertyType<Element<*>, 'ref'>,
  };

  declare type ChildHook = (element: ElementShape, node: ?HTMLElement) => mixed;

  declare export type ChildrenHook = (
    elements: Array<Element<*>>,
    nodes: Array<?HTMLElement>
  ) => mixed;

  declare export type GetPosition = (node: HTMLElement) => ClientRect;

  declare export type VerticalAlignment = 'top' | 'bottom';

  declare export type CommonProps = {
    children: Node,
    easing: string,
    typeName: string,
    disableAllAnimations: boolean,
    getPosition: GetPosition,
    maintainContainerHeight: boolean,
    verticalAlignment: VerticalAlignment,
    onStart?: ChildHook,
    onFinish?: ChildHook,
    onStartAll?: ChildrenHook,
    onFinishAll?: ChildrenHook,
  };

  declare export type DelegatedProps = {
    style?: ReactStyles,
  };

  declare export type FlipMoveProps = CommonProps & DelegatedProps & {
    duration: string | number,
    delay: string | number,
    staggerDurationBy: string | number,
    staggerDelayBy: string | number,
    enterAnimation: AnimationProp,
    leaveAnimation: AnimationProp,
    appearAnimation?: AnimationProp,
    disableAnimations?: boolean, // deprecated, use disableAllAnimations instead
  };

  declare export default ComponentType<FlipMoveProps>;
}
