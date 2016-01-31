import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


class FlipMove extends Component {
  componentWillReceiveProps(nextProps) {
    this.props.children.forEach(child => {
      // It is possible that a child does not have a `key` property;
      // Ignore these children, they don't need to be moved.
      if ( !child.key ) return;

      const domNode     = ReactDOM.findDOMNode( this.refs[child.key] );
      const boundingBox = domNode.getBoundingClientRect();

      this.setState({ [child.key]: boundingBox });
    });
  }

  componentDidUpdate(prevProps) {
    // If we haven't assigned any keys to state yet, it's the first render.
    // The first render cannot possibly have any animations. No work needed.
    if ( !this.state ) return;

    this.props.children.forEach(child => {
      if ( !child.key ) return;

      // The new box can be calculated from the current DOM state.
      // The old box was stored in this.state when the component received props.
      const domNode = ReactDOM.findDOMNode( this.refs[child.key] );
      const newBox  = domNode.getBoundingClientRect();
      const oldBox  = this.state[child.key];
      const deltaX  = oldBox.left - newBox.left;
      const deltaY  = oldBox.top  - newBox.top;

      // If the element has not moved, no animation is necessary.
      if ( !deltaX && !deltaY ) return;

      let settings = {...this.props};
      if ( typeof settings.duration === 'string' ) {
        settings.duration = parseInt(settings.duration)
      }

      domNode.animate([
        { transform: `translate(${deltaX}px, ${deltaY}px)`},
        { transform: 'translate(0,0)'}
      ], settings);
    });
  }

  childrenWithRefs () {
    return this.props.children.map(child => {
      return React.cloneElement(child, { ref: child.key });
    });
  }

  render() {
    return (
      <div>
        {this.childrenWithRefs()}
      </div>
    );
  }

  static propTypes = {
    children:   PropTypes.array.isRequired,
    duration:   PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    easing:     PropTypes.string,
    delay:      PropTypes.number,
    iterations: PropTypes.number,
    direction:  PropTypes.string,
    fill:       PropTypes.string,
    onComplete: PropTypes.func
  };

  static defaultProps = {
    duration:   350,
    easing:     'ease-in-out',
    delay:      0,
    iterations: 1,
    direction:  'normal',
    fill:       'none'
  };
}

export default FlipMove;
