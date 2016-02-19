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
 */

import React, { Component, PropTypes } from 'react';

import { convertToInt } from './helpers.js';


function propConverter(ComposedComponent) {
  return class Converter extends Component {
    convertProps(props) {
      // Create a non-immutable working copy
      let workingProps = { ...props };

      // Do string-to-int conversion for all timing-related props
      const timingPropNames = [ 'duration', 'delay', 'staggerDurationBy', 'staggerDelayBy' ];

      timingPropNames.forEach(
        prop => workingProps[prop] = convertToInt(workingProps[prop], prop)
      );

      // Convert the children to a React.Children array.
      // This is to ensure we're always working with an array, and not
      // an only child. There's some weirdness with this.
      // See: https://github.com/facebook/react/pull/3650/files
      workingProps.children = React.Children.toArray(this.props.children);

      return workingProps;
    }

    render() {
      return (
        <ComposedComponent {...this.convertProps(this.props)} />
      );
    }

    static propTypes = {
      children:           PropTypes.oneOfType([
                            PropTypes.array,
                            PropTypes.object
                          ]).isRequired,
      easing:             PropTypes.string,
      duration:           PropTypes.oneOfType([
                            PropTypes.string,
                            PropTypes.number
                          ]),
      delay:              PropTypes.oneOfType([
                            PropTypes.string,
                            PropTypes.number
                          ]),
      staggerDurationBy:  PropTypes.oneOfType([
                            PropTypes.string,
                            PropTypes.number
                          ]),
      staggerDelayBy:     PropTypes.oneOfType([
                            PropTypes.string,
                            PropTypes.number
                          ]),
      onStart:            PropTypes.func,
      onFinish:           PropTypes.func,
      className:          PropTypes.string,
      typeName:           PropTypes.string
    };

    static defaultProps = {
      easing:             'ease-in-out',
      duration:           350,
      delay:              0,
      staggerDurationBy:  0,
      staggerDelayBy:     0,
      typeName:           'div'
    };
  }
}

export default propConverter;
