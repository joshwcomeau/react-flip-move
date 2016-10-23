import React, { Component, PropTypes } from 'react';


// eslint-disable-next-line react/prefer-stateless-function
class FlipMoveListItem extends Component {
  render() {
    const { style, children } = this.props;

    return (
      <div style={style}>
        {children}
      </div>
    );
  }
}

FlipMoveListItem.propTypes = {
  children: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

export default FlipMoveListItem;
