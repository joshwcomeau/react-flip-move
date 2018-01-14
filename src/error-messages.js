// @flow
import type { Presets } from './typings';

function warnOnce(msg: string) {
  let hasWarned = false;
  return () => {
    if (!hasWarned) {
      console.warn(msg);
      hasWarned = true;
    }
  };
}

export const statelessFunctionalComponentSupplied = warnOnce(`
>> Error, via react-flip-move <<

You provided a stateless functional component as a child to <FlipMove>. Unfortunately, SFCs aren't supported, because Flip Move needs access to the backing instances via refs, and SFCs don't have a public instance that holds that info.

Please wrap your components in a native element (eg. <div>), or a non-functional component.
`);

export const primitiveNodeSupplied = warnOnce(`
>> Error, via react-flip-move <<

You provided a primitive (text or number) node as a child to <FlipMove>. Flip Move needs containers with unique keys to move children around.

Please wrap your value in a native element (eg. <span>), or a component.
`);

export const invalidTypeForTimingProp = (args: {
  prop: string,
  value: string | number,
  defaultValue: number,
}) =>
  // prettier-ignore
  console.error(`
>> Error, via react-flip-move <<

The prop you provided for '${args.prop}' is invalid. It needs to be a positive integer, or a string that can be resolved to a number. The value you provided is '${args.value}'.

As a result,  the default value for this parameter will be used, which is '${args.defaultValue}'.
`);

export const invalidEnterLeavePreset = (args: {
  value: string,
  acceptableValues: string,
  defaultValue: $Keys<Presets>,
}) =>
  // prettier-ignore
  console.error(`
>> Error, via react-flip-move <<

The enter/leave preset you provided is invalid. We don't currently have a '${args.value} preset.'

Acceptable values are ${args.acceptableValues}. The default value of '${args.defaultValue}' will be used.
`);

export const parentNodePositionStatic = warnOnce(`
>> Warning, via react-flip-move <<

When using "wrapperless" mode (by supplying 'typeName' of 'null'), strange things happen when the direct parent has the default "static" position.

FlipMove has added 'position: relative' to this node, to ensure Flip Move animates correctly.

To avoid seeing this warning, simply apply a non-static position to that parent node.
`);

export const childIsDisabled = warnOnce(`
>> Warning, via react-flip-move <<

One or more of Flip Move's child elements have the html attribute 'disabled' set to true.

Please note that this will cause animations to break in Internet Explorer 11 and below. Either remove the disabled attribute or set 'animation' to false.
`);
