/**
 * React Flip Move | propConverter
 * (c) 2016-present Joshua Comeau
 *
 * Abstracted away a bunch of the messy business with props.
 *   - propTypes and defaultProps
 *   - Type conversion (We accept 'string' and 'number' values for duration,
 *     delay, and other fields, but we actually need them to be ints.)
 *   - Children conversion (we need the children to be an array. May not always
 *     be, if a single child is passed in.)
 *   - Resolving animation presets into their base CSS styles
 */

import React, { Component, PropTypes } from 'react';
import omit from 'lodash.omit';

import { convertToInt } from './helpers.js';
import {
  enterPresets, leavePresets, defaultPreset, disablePreset
} from './enter-leave-presets';


function propConverter(ComposedComponent) {
  return class FlipMovePropConverter extends Component {
    convertProps(props) {
      // Create a non-immutable working copy
      let workingProps = { ...props };

      // Do string-to-int conversion for all timing-related props
      const timingPropNames = [
        'duration', 'delay', 'staggerDurationBy', 'staggerDelayBy'
      ];

      timingPropNames.forEach(
        prop => workingProps[prop] = convertToInt(workingProps[prop], prop)
      );

      // Convert the children to a React.Children array.
      // This is to ensure we're always working with an array, and not
      // an only child. There's some weirdness with this.
      // See: https://github.com/facebook/react/pull/3650/files
      workingProps.children = React.Children.toArray(this.props.children);

      // Convert an enterLeave preset to the real thing
      workingProps.enterAnimation = this.convertAnimationProp(
        workingProps.enterAnimation, enterPresets
      );
      workingProps.leaveAnimation = this.convertAnimationProp(
        workingProps.leaveAnimation, leavePresets
      );

      // Accept `disableAnimations`, but add a deprecation warning
      if ( typeof props.disableAnimations !== 'undefined' ) {
        console.warn("Warning, via react-flip-move: `disableAnimations` is deprecated. Please switch to use `disableAllAnimations`. This will become a silent error in future versions.");
        workingProps.disableAnimations = undefined;
        workingProps.disableAllAnimations = props.disableAnimations;
      }

      // Gather any additional props; they will be delegated to the
      // ReactElement created.
      const primaryPropKeys = Object.keys(FlipMovePropConverter.propTypes);
      const delegatedProps = omit(this.props, primaryPropKeys);

      // The FlipMove container element needs to have a non-static position.
      // We use `relative` by default, but it can be overridden by the user.
      // Now that we're delegating props, we need to merge this in.
      delegatedProps.style = {
        position: 'relative',
        ...delegatedProps.style
      };

      workingProps = omit(workingProps, delegatedProps);
      workingProps.delegated = delegatedProps;

      return workingProps;
    }


    convertAnimationProp(animation, presets) {
      let newAnimation;

      switch ( typeof animation ) {
        case 'boolean':
          // If it's true, we want to use the default preset.
          // If it's false, we want to use the 'none' preset.
          newAnimation = presets[
            animation ? defaultPreset : disablePreset
          ];
          break;

        case 'string':
          const presetKeys = Object.keys(presets);
          if ( presetKeys.indexOf(animation) === -1 ) {
            console.warn(`Warning, via react-flip-move: You supplied an invalid preset name of '${animation}'. The accepted values are: ${presetKeys.join(', ')}. Defaulting to ${defaultPreset}`);
            newAnimation = presets[defaultPreset];
          } else {
            newAnimation = presets[animation];
          }
          break;

        case 'object':
          // Ensure it has a 'from' and a 'to'.
          if (
            typeof animation.from !== 'object' ||
            typeof animation.to !== 'object'
          ) {
            console.error("Error, via react-flip-move: Please provide `from` and `to` properties when supplying a custom animation object, or use a preset.");
          }

          // TODO: More thorough validation? Ensure valid CSS properties?

          newAnimation = animation;
          break;
      }

      return newAnimation;
    }


    render() {
      return (
        <ComposedComponent {...this.convertProps(this.props)} />
      );
    }


    static propTypes = {
      children:             PropTypes.oneOfType([
                              PropTypes.array,
                              PropTypes.object
                            ]),
      easing:               PropTypes.string,
      duration:             PropTypes.oneOfType([
                              PropTypes.string,
                              PropTypes.number
                            ]),
      delay:                PropTypes.oneOfType([
                              PropTypes.string,
                              PropTypes.number
                            ]),
      staggerDurationBy:    PropTypes.oneOfType([
                              PropTypes.string,
                              PropTypes.number
                            ]),
      staggerDelayBy:       PropTypes.oneOfType([
                              PropTypes.string,
                              PropTypes.number
                            ]),
      onStart:              PropTypes.func,
      onFinish:             PropTypes.func,
      onStartAll:           PropTypes.func,
      onFinishAll:          PropTypes.func,
      typeName:             PropTypes.string,
      disableAllAnimations: PropTypes.bool,
      enterAnimation:       PropTypes.oneOfType([
                              PropTypes.string,
                              PropTypes.bool,
                              PropTypes.object
                            ]),
      leaveAnimation:       PropTypes.oneOfType([
                              PropTypes.string,
                              PropTypes.bool,
                              PropTypes.object
                            ]),
      getPosition:          PropTypes.func,
      };


    static defaultProps = {
      easing:             'ease-in-out',
      duration:           350,
      delay:              0,
      staggerDurationBy:  0,
      staggerDelayBy:     0,
      typeName:           'div',
      enterAnimation:     defaultPreset,
      leaveAnimation:     defaultPreset,
      getPosition:        node => node.getBoundingClientRect(),
    };
  }
}

export default propConverter;
