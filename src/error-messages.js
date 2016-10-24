export const invalidTypeForTimingProp = ({
  prop,
  value,
  defaultValue,
}) => `
>> Error, via react-flip-move <<

The prop you provided for '${prop}' is invalid. It needs to be a positive integer, or a string that can be resolved to a number. The value you provided is '${value}'.

As a result,  the default value for this parameter will be used, which is '${defaultValue}'.
`;

export const deprecatedDisableAnimations = () => `
>> Warning, via react-flip-move <<

The 'disableAnimations' prop you provided is deprecated. Please switch to use 'disableAllAnimations'.

This will become a silent error in future versions of react-flip-move.
`;

export const invalidEnterLeavePreset = ({
  value,
  acceptableValues,
  defaultValue,
}) => `
>> Error, via react-flip-move <<

The enter/leave preset you provided is invalid. We don't currently have a '${value} preset.'

Acceptable values are ${acceptableValues}. The default value of '${defaultValue}' will be used.
`;
