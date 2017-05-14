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

export const invalidTypeForTimingProp = (args: {
  prop: string,
  value: string | number,
  defaultValue: number,
}) => console.error(`
>> Error, via react-flip-move <<

The prop you provided for '${args.prop}' is invalid. It needs to be a positive integer, or a string that can be resolved to a number. The value you provided is '${args.value}'.

As a result,  the default value for this parameter will be used, which is '${args.defaultValue}'.
`);

export const deprecatedDisableAnimations = warnOnce(`
>> Warning, via react-flip-move <<

The 'disableAnimations' prop you provided is deprecated. Please switch to use 'disableAllAnimations'.

This will become a silent error in future versions of react-flip-move.
`);

export const invalidEnterLeavePreset = (args: {
  value: string,
  acceptableValues: string,
  defaultValue: $Keys<Presets>,
}) => console.error(`
>> Error, via react-flip-move <<

The enter/leave preset you provided is invalid. We don't currently have a '${args.value} preset.'

Acceptable values are ${args.acceptableValues}. The default value of '${args.defaultValue}' will be used.
`);
