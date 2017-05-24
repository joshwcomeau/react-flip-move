import * as React from 'react';
import FlipMove from '..';

function childHook(el: React.ReactElement<any>, node: HTMLElement) {}
function childrenHook(els: Array<React.ReactElement<any>>, nodes: Array<HTMLElement>) {}

// tslint:disable-next-line:no-unused-expression
<FlipMove
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
