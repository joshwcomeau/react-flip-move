import * as React from 'react';

export interface Styles {
    [key: string]: string;
}

export interface ReactStyles {
    [key: string]: string | number;
}

export interface Animation {
    from: Styles;
    to: Styles;
}

export interface Presets {
    elevator: Animation;
    fade: Animation;
    accordionVertical: Animation;
    accordionHorizontal: Animation;
    none: null;
}

export type AnimationProp = keyof Presets | boolean | Animation;

export interface ClientRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
    height: number;
    width: number;
}

export type ChildHook = (element: React.ReactElement<any>, node?: HTMLElement | null) => void;

export type ChildrenHook = (
    elements: Array<React.ReactElement<any>>,
    nodes: Array<HTMLElement | null>,
) => void;

export type GetPosition = (node: HTMLElement) => ClientRect;

export type VerticalAlignment = 'top' | 'bottom';

export interface FlipMoveProps {
    easing?: string;
    duration?: string | number;
    delay?: string | number;
    staggerDurationBy?: string | number;
    staggerDelayBy?: string | number;
    typeName?: string;
    enterAnimation?: AnimationProp;
    leaveAnimation?: AnimationProp;
    disableAllAnimations?: boolean;
    getPosition?: GetPosition;
    maintainContainerHeight?: boolean;
    verticalAlignment?: VerticalAlignment;
    onStart?: ChildHook;
    onFinish?: ChildHook;
    onStartAll?: ChildrenHook;
    onFinishAll?: ChildrenHook;
    style?: ReactStyles;
    children: any;
    appearAnimation?: AnimationProp;
    disableAnimations?: boolean; // deprecated, use disableAllAnimations instead
}

declare class FlipMove extends React.Component<FlipMoveProps, void> {}

export default FlipMove;
