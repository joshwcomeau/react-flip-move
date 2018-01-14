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

import React, { Component, Children } from 'react';
// eslint-disable-next-line no-duplicate-imports
import type { ComponentType, Element } from 'react';

import {
  statelessFunctionalComponentSupplied,
  primitiveNodeSupplied,
  invalidTypeForTimingProp,
  invalidEnterLeavePreset,
} from './error-messages';
import {
  appearPresets,
  enterPresets,
  leavePresets,
  defaultPreset,
  disablePreset,
} from './enter-leave-presets';
import { isElementAnSFC, omit } from './helpers';
import type {
  Animation,
  AnimationProp,
  Presets,
  FlipMoveProps,
  ConvertedProps,
  DelegatedProps,
} from './typings';

declare var process: {
  env: {
    NODE_ENV: 'production' | 'development',
  },
};

function propConverter(
  ComposedComponent: ComponentType<ConvertedProps>,
): ComponentType<FlipMoveProps> {
  return class FlipMovePropConverter extends Component<FlipMoveProps> {
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
      getPosition: (node: HTMLElement) => node.getBoundingClientRect(),
      maintainContainerHeight: false,
      verticalAlignment: 'top',
    };

    // eslint-disable-next-line class-methods-use-this
    checkChildren(children) {
      // Skip all console warnings in production.
      // Bail early, to avoid unnecessary work.
      if (process.env.NODE_ENV === 'production') {
        return;
      }

      // same as React.Node, but without fragments, see https://github.com/facebook/flow/issues/4781
      type Child = void | null | boolean | number | string | Element<*>;

      // FlipMove does not support stateless functional components.
      // Check to see if any supplied components won't work.
      // If the child doesn't have a key, it means we aren't animating it.
      // It's allowed to be an SFC, since we ignore it.
      Children.forEach(children, (child: Child) => {
        // null, undefined, and booleans will be filtered out by Children.toArray
        if (child == null || typeof child === 'boolean') {
          return;
        }

        if (typeof child !== 'object') {
          primitiveNodeSupplied();
          return;
        }

        if (isElementAnSFC(child) && child.key != null) {
          statelessFunctionalComponentSupplied();
        }
      });
    }

    convertProps(props: FlipMoveProps): ConvertedProps {
      const workingProps: ConvertedProps = {
        // explicitly bypass the props that don't need conversion
        children: props.children,
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

        // Do string-to-int conversion for all timing-related props
        duration: this.convertTimingProp('duration'),
        delay: this.convertTimingProp('delay'),
        staggerDurationBy: this.convertTimingProp('staggerDurationBy'),
        staggerDelayBy: this.convertTimingProp('staggerDelayBy'),

        // Our enter/leave animations can be specified as boolean (default or
        // disabled), string (preset name), or object (actual animation values).
        // Let's standardize this so that they're always objects
        appearAnimation: this.convertAnimationProp(
          props.appearAnimation,
          appearPresets,
        ),
        enterAnimation: this.convertAnimationProp(
          props.enterAnimation,
          enterPresets,
        ),
        leaveAnimation: this.convertAnimationProp(
          props.leaveAnimation,
          leavePresets,
        ),

        delegated: {},
      };

      this.checkChildren(workingProps.children);

      // Gather any additional props;
      // they will be delegated to the ReactElement created.
      const primaryPropKeys = Object.keys(workingProps);
      const delegatedProps: DelegatedProps = omit(this.props, primaryPropKeys);

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

    convertTimingProp(prop: string): number {
      const rawValue: string | number = this.props[prop];

      const value =
        typeof rawValue === 'number' ? rawValue : parseInt(rawValue, 10);

      if (isNaN(value)) {
        const defaultValue: number = FlipMovePropConverter.defaultProps[prop];

        if (process.env.NODE_ENV !== 'production') {
          invalidTypeForTimingProp({
            prop,
            value: rawValue,
            defaultValue,
          });
        }

        return defaultValue;
      }

      return value;
    }

    // eslint-disable-next-line class-methods-use-this
    convertAnimationProp(
      animation: ?AnimationProp,
      presets: Presets,
    ): ?Animation {
      switch (typeof animation) {
        case 'boolean': {
          // If it's true, we want to use the default preset.
          // If it's false, we want to use the 'none' preset.
          return presets[animation ? defaultPreset : disablePreset];
        }

        case 'string': {
          const presetKeys = Object.keys(presets);

          if (presetKeys.indexOf(animation) === -1) {
            if (process.env.NODE_ENV !== 'production') {
              invalidEnterLeavePreset({
                value: animation,
                acceptableValues: presetKeys.join(', '),
                defaultValue: defaultPreset,
              });
            }

            return presets[defaultPreset];
          }

          return presets[animation];
        }

        default: {
          return animation;
        }
      }
    }

    render() {
      return <ComposedComponent {...this.convertProps(this.props)} />;
    }
  };
}

export default propConverter;
