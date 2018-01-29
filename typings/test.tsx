// tslint:disable:max-classes-per-file

import * as React from 'react';
import FlipMove from '..';

function childHook(el: React.ReactElement<any>, node: HTMLElement) {}
function childrenHook(els: Array<React.ReactElement<any>>, nodes: Array<HTMLElement>) {}

class ExtendedTest extends React.Component<any, any> {
    public render() {
        return <FlipMove
            easing="ease-out"
            duration={100}
            delay={100}
            staggerDurationBy={100}
            staggerDelayBy={100}
            typeName="ul"
            appearAnimation="elevator"
            enterAnimation="fade"
            leaveAnimation="accordionVertical"
            disableAllAnimations={true}
            getPosition={(node: HTMLElement) => ({
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                height: 0,
                width: 0,
            })}
            maintainContainerHeight={true}
            verticalAlignment="top"
            onStart={childHook}
            onFinish={childHook}
            onStartAll={childrenHook}
            onFinishAll={childrenHook}
            style={{
                height: 0,
                color: 'red',
            }}
        >
            <div />
            <div />
        </FlipMove>;
    }
}

class DefaultTest extends React.Component<any, any> {
    public render() {
        return <FlipMove />;
    }
}

class PresetTest extends React.Component<any, any> {
    public render() {
        return (
            <FlipMove
                appearAnimation="fade"
                enterAnimation="accordionHorizontal"
                leaveAnimation="accordionVertical"
            />
        );
    }
}

class CustomAnimationTest extends React.Component<any, any> {
    public render() {
        const enterAnimation: FlipMove.Animation = {
            from: { opacity: '0' },
            to: { opacity: '1' },
        };

        const leaveAnimation: FlipMove.Animation = {
            from: { opacity: '1' },
            to: { opacity: '0' },
        };

        return (
            <FlipMove
                enterAnimation={enterAnimation}
                appearAnimation={enterAnimation}
                leaveAnimation={leaveAnimation}
            />
        );
    }
}

class FlipMoveTest extends React.Component<any, any> {
    public onStart = (childElement: React.ReactElement<any>, domNode: HTMLElement) => {};

    public onFinish = (childElement: React.ReactElement<any>, domNode: HTMLElement) => {};

    public onStartAll = (childElements: Array<React.ReactElement<any>>, domNodes: Array<HTMLElement>) => {};

    public onFinishAll = (childElements: Array<React.ReactElement<any>>, domNodes: Array<HTMLElement>) => {};

    public render() {
        return (
            <FlipMove
                delay={0}
                staggerDelayBy={20}
                duration={200}
                staggerDurationBy={20}
                maintainContainerHeight
                disableAllAnimations={false}
                easing="cubic-bezier(1, 0, 0, 1)"
                onStart={this.onStart}
                onFinish={this.onFinish}
                onStartAll={this.onStartAll}
                onFinishAll={this.onFinishAll}
            />
        );
    }
}
