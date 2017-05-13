import React, { Component } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
class FlipMoveListItem extends Component {
  render() {
    const { style, id, children } = this.props;

    return (
      <div style={style} id={id}>
        {children}
      </div>
    );
  }
}

FlipMoveListItem.propTypes = {
  children: PropTypes.string,
  id: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

export default FlipMoveListItem;
