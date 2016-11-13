import React, { PropTypes } from 'react';


// eslint-disable-next-line react/prefer-stateless-function
const FlipMoveListItemLegacy = React.createClass({
  render() {
    const { style, children } = this.props;

    return (
      <div style={style}>
        {children}
      </div>
    );
  },
});

FlipMoveListItemLegacy.propTypes = {
  children: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

export default FlipMoveListItemLegacy;
