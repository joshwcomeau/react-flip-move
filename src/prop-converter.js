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
/* eslint-disable block-scoped-var */

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

import {
  statelessFunctionalComponentSupplied,
  invalidTypeForTimingProp,
  invalidEnterLeavePreset,
  deprecatedDisableAnimations,
} from './error-messages';
import {
  appearPresets,
  enterPresets,
  leavePresets,
  defaultPreset,
  disablePreset,
} from './enter-leave-presets';
import { isElementAnSFC, omit } from './helpers';


let nodeEnv;
try {
  nodeEnv = process.env.NODE_ENV;
} catch (e) {
  nodeEnv = 'development';
}

function propConverter(ComposedComponent) {
  class FlipMovePropConverter extends Component {
    checkForStatelessFunctionalComponents(children) {
      // Skip all console warnings in production.
      // Bail early, to avoid unnecessary work.
      if (nodeEnv === 'production') {
        return;
      }

      // FlipMove does not support stateless functional components.
      // Check to see if any supplied components won't work.
      // If the child doesn't have a key, it means we aren't animating it.
      // It's allowed to be an SFC, since we ignore it.
      const noStateless = Children.toArray(children).every(child =>
         !isElementAnSFC(child) || typeof child.key === 'undefined'
      );

      if (!noStateless) {
        console.warn(statelessFunctionalComponentSupplied());
      }
    }

    convertProps(props) {
      const { propTypes, defaultProps } = FlipMovePropConverter;

      // Create a non-immutable working copy
      let workingProps = { ...props };

      this.checkForStatelessFunctionalComponents(workingProps.children);

      // Do string-to-int conversion for all timing-related props
      const timingPropNames = [
        'duration', 'delay', 'staggerDurationBy', 'staggerDelayBy',
      ];

      timingPropNames.forEach((prop) => {
        const rawValue = workingProps[prop];
        let value = typeof rawValue === 'string'
          ? parseInt(rawValue, 10)
          : rawValue;

        if (isNaN(value)) {
          const defaultValue = defaultProps[prop];

          if (nodeEnv !== 'production') {
            console.error(invalidTypeForTimingProp({
              prop,
              value,
              defaultValue,
            }));
          }

          value = defaultValue;
        }

        workingProps[prop] = value;
      });

      // Our enter/leave animations can be specified as boolean (default or
      // disabled), string (preset name), or object (actual animation values).
      // Let's standardize this so that they're always objects
      workingProps.appearAnimation = this.convertAnimationProp(
        workingProps.appearAnimation, appearPresets
      );
      workingProps.enterAnimation = this.convertAnimationProp(
        workingProps.enterAnimation, enterPresets
      );
      workingProps.leaveAnimation = this.convertAnimationProp(
        workingProps.leaveAnimation, leavePresets
      );

      // Accept `disableAnimations`, but add a deprecation warning
      if (typeof props.disableAnimations !== 'undefined') {
        if (nodeEnv !== 'production') {
          console.warn(deprecatedDisableAnimations());
        }

        workingProps.disableAnimations = undefined;
        workingProps.disableAllAnimations = props.disableAnimations;
      }

      // Gather any additional props;
      // they will be delegated to the ReactElement created.
      const primaryPropKeys = Object.keys(propTypes);
      const delegatedProps = omit(this.props, primaryPropKeys);

      // The FlipMove container element needs to have a non-static position.
      // We use `relative` by default, but it can be overridden by the user.
      // Now that we're delegating props, we need to merge this in.
      delegatedProps.style = {
        position: 'relative',
        ...delegatedProps.style,
      };

      workingProps = omit(workingProps, Object.keys(delegatedProps));
      workingProps.delegated = delegatedProps;

      return workingProps;
    }

    // eslint-disable-next-line class-methods-use-this
    convertAnimationProp(animation, presets) {
      let newAnimation;

      switch (typeof animation) {
        case 'boolean': {
          // If it's true, we want to use the default preset.
          // If it's false, we want to use the 'none' preset.
          newAnimation = presets[
            animation ? defaultPreset : disablePreset
          ];
          break;
        }

        case 'string': {
          const presetKeys = Object.keys(presets);

          if (presetKeys.indexOf(animation) === -1) {
            if (nodeEnv !== 'production') {
              console.error(invalidEnterLeavePreset({
                value: animation,
                acceptableValues: presetKeys.join(', '),
                defaultValue: defaultPreset,
              }));
            }

            newAnimation = presets[defaultPreset];
          } else {
            newAnimation = presets[animation];
          }
          break;
        }

        default: {
          newAnimation = animation;
          break;
        }
      }

      return newAnimation;
    }


    render() {
      return (
        <ComposedComponent {...this.convertProps(this.props)} />
      );
    }
  }

  const animationPropTypes = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.shape({
      from: PropTypes.object,
      to: PropTypes.object,
    }),
  ]);

  FlipMovePropConverter.propTypes = {
    children: PropTypes.node,
    easing: PropTypes.string,
    duration: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    delay: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    staggerDurationBy: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    staggerDelayBy: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onStart: PropTypes.func,
    onFinish: PropTypes.func,
    onStartAll: PropTypes.func,
    onFinishAll: PropTypes.func,
    typeName: PropTypes.string,
    appearAnimation: animationPropTypes,
    enterAnimation: animationPropTypes,
    leaveAnimation: animationPropTypes,
    disableAllAnimations: PropTypes.bool,
    getPosition: PropTypes.func,
    maintainContainerHeight: PropTypes.bool.isRequired,
    verticalAlignment: PropTypes.oneOf(['top', 'bottom']).isRequired,
  };

  FlipMovePropConverter.defaultProps = {
    easing: 'ease-in-out',
    duration: 350,
    delay: 0,
    staggerDurationBy: 0,
    staggerDelayBy: 0,
    typeName: 'div',
    enterAnimation: defaultPreset,
    leaveAnimation: defaultPreset,
    disableAllAnimations: false,
    getPosition: node => node.getBoundingClientRect(),
    maintainContainerHeight: false,
    verticalAlignment: 'top',
  };

  return FlipMovePropConverter;
}

export default propConverter;
