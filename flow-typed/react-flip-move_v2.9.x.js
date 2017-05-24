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
    type: $PropertyType<React$Element<*>, 'type'>,
    props: $PropertyType<React$Element<*>, 'props'>,
    key: $PropertyType<React$Element<*>, 'key'>,
    ref: $PropertyType<React$Element<*>, 'ref'>,
  };

  declare type ChildHook = (element: ElementShape, node: ?HTMLElement) => mixed;

  declare export type ChildrenHook = (
    elements: Array<ElementShape>,
    nodes: Array<?HTMLElement>
  ) => mixed;

  declare export type GetPosition = (node: HTMLElement) => ClientRect;

  declare export type VerticalAlignment = 'top' | 'bottom';

  // this one cannot use intersection, see https://github.com/facebook/flow/issues/2904
  declare export type FlipMoveDefaultProps = {
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

  declare export type Hooks = {
    onStart?: ChildHook,
    onFinish?: ChildHook,
    onStartAll?: ChildrenHook,
    onFinishAll?: ChildrenHook,
  };

  declare export type DelegatedProps = {
    style?: ReactStyles,
  };

  declare export type FlipMoveProps = FlipMoveDefaultProps & Hooks & DelegatedProps & {
    children?: mixed,
    appearAnimation?: AnimationProp,
    disableAnimations?: boolean, // deprecated, use disableAllAnimations instead
  };

  declare export default Class<React$Component<FlipMoveDefaultProps, FlipMoveProps, void>>;
}
