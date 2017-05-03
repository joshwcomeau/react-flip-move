// @flow
/**
 * React Flip Move | propConverter
 * (c) 2016-present Joshua Comeau
 *
 * Abstracted away a bunch of the messy business with props.
 *   - props flow types and defaultProps
 *   - Type conversion (We accept 'string' and 'number' values for duration,
 *     delay, and other fields, but we actually need them to be ints.)
 *   - Children conversion (we need the children to be an array. May not always
 *     be, if a single child is passed in.)
 *   - Resolving animation presets into their base CSS styles
 */
/* eslint-disable block-scoped-var */

import React, {
  Component,
  Element,
} from 'react';

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

type Animation = string | boolean | {
  from: Object,
  to: Object
}

type ClientRect = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  height: number,
  width: number
}

type FlipMoveProps = {
  children: mixed,
  easing: string,
  duration: string | number,
  delay: string | number,
  staggerDurationBy: string | number,
  staggerDelayBy: string | number,
  onStart?: (Element<*>, Node) => mixed,
  onFinish?: (Element<*>, Node) => mixed,
  onStartAll?: (Array<Element<*>>, Array<Node>) => mixed,
  onFinishAll?: (Array<Element<*>>, Array<Node>) => mixed,
  typeName: string,
  appearAnimation?: Animation,
  enterAnimation: Animation,
  leaveAnimation: Animation,
  disableAnimations: boolean, // deprecated, use disableAllAnimations instead
  disableAllAnimations: boolean,
  getPosition: (Node) => ClientRect,
  maintainContainerHeight: boolean,
  verticalAlignment: 'top' | 'bottom',
};

function propConverter(ComposedComponent: Class<Component<*, *, *>>) {
  return class FlipMovePropConverter extends Component {
    props: FlipMoveProps

    static defaultProps = {
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

    // eslint-disable-next-line class-methods-use-this
    checkForStatelessFunctionalComponents(children: Array<*>) {
      // Skip all console warnings in production.
      // Bail early, to avoid unnecessary work.
      if (nodeEnv === 'production') {
        return;
      }

      // FlipMove does not support stateless functional components.
      // Check to see if any supplied components won't work.
      // If the child doesn't have a key, it means we aren't animating it.
      // It's allowed to be an SFC, since we ignore it.
      const noStateless = children.every(child =>
         !isElementAnSFC(child) || typeof child.key === 'undefined'
      );

      if (!noStateless) {
        console.warn(statelessFunctionalComponentSupplied());
      }
    }

    convertProps(props: FlipMoveProps) {
      const workingProps = {
        // explicitly bypass the props that don't need conversion
        easing: props.easing,
        onStart: props.onStart,
        onFinish: props.onFinish,
        onStartAll: props.onStartAll,
        onFinishAll: props.onFinishAll,
        typeName: props.typeName,
        disableAllAnimations: props.disableAllAnimations,
        getPosition: props.getPosition,
        maintainContainerHeight: props.maintainContainerHeight,
        verticalAlignment: props.verticalAlignment,

        // Convert `children` to an array. This is to standardize when a single
        // child is passed, as well as if the child is falsy.
        children: React.Children.toArray(props.children),

        // Do string-to-int conversion for all timing-related props
        duration: this.convertTimingProp('duration'),
        delay: this.convertTimingProp('delay'),
        staggerDurationBy: this.convertTimingProp('staggerDurationBy'),
        staggerDelayBy: this.convertTimingProp('staggerDelayBy'),

        // Our enter/leave animations can be specified as boolean (default or
        // disabled), string (preset name), or object (actual animation values).
        // Let's standardize this so that they're always objects
        appearAnimation: this.convertAnimationProp(
          props.appearAnimation, appearPresets
        ),
        enterAnimation: this.convertAnimationProp(
          props.enterAnimation, enterPresets
        ),
        leaveAnimation: this.convertAnimationProp(
          props.leaveAnimation, leavePresets
        ),

        delegated: {},
      };

      this.checkForStatelessFunctionalComponents(workingProps.children);

      // Accept `disableAnimations`, but add a deprecation warning
      if (typeof props.disableAnimations !== 'undefined') {
        if (nodeEnv !== 'production') {
          console.warn(deprecatedDisableAnimations());
        }

        workingProps.disableAllAnimations = props.disableAnimations;
      }

      // Gather any additional props;
      // they will be delegated to the ReactElement created.
      const primaryPropKeys = Object.keys(workingProps);
      const delegatedProps = omit(this.props, primaryPropKeys);

      // The FlipMove container element needs to have a non-static position.
      // We use `relative` by default, but it can be overridden by the user.
      // Now that we're delegating props, we need to merge this in.
      delegatedProps.style = {
        position: 'relative',
        ...delegatedProps.style,
      };

      workingProps.delegated = delegatedProps;

      return workingProps;
    }

    convertTimingProp(prop: string) {
      const rawValue: string | number = this.props[prop];

      let value = typeof rawValue === 'number'
        ? rawValue
        : parseInt(rawValue, 10);

      if (isNaN(value)) {
        const defaultValue: number = FlipMovePropConverter.defaultProps[prop];

        if (nodeEnv !== 'production') {
          console.error(invalidTypeForTimingProp({
            prop,
            rawValue,
            defaultValue,
          }));
        }

        value = defaultValue;
      }

      return value;
    }

    // eslint-disable-next-line class-methods-use-this
    convertAnimationProp(animation: ?Animation, presets: Object) {
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
                acceptableValues: presetKeys.join(';, '),
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
  };
}

export default propConverter;
