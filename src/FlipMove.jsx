import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


class FlipMove extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired
  };

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

      // If the deltas have not changed, no animation is necessary.
      if ( !deltaX && !deltaY ) return;


      domNode.animate([
        { transform: `translate(${deltaX}px, ${deltaY}px)`},
        { transform: 'translate(0,0)'}
      ], {
        duration: 150
      });
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
}

export default FlipMove;
