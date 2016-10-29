import React, { PropTypes } from 'react';


const styles = {
  button: {
    padding: '5px 20px',
    marginRight: '10px',
    fontSize: '14px',
  },
};

const Controls = ({
  onRemove,
  onRemoveAll,
  onRestore,
  onRotate,
  onShuffle,
  numOfCurrentItems,
  numOfTotalItems,
}) => (
  <div className="controls">
    <button
      onClick={() => onRemove()}
      style={styles.button}
      disabled={numOfCurrentItems === 0}
    >
      Remove 1 Item
    </button>

    <button
      onClick={() => onRemoveAll()}
      style={styles.button}
      disabled={numOfCurrentItems === 0}
    >
      Remove All Items
    </button>

    <button
      onClick={() => onRestore()}
      style={styles.button}
      disabled={numOfCurrentItems === numOfTotalItems}
    >
      Restore Items
    </button>

    <button onClick={() => onShuffle()} style={styles.button}>
      Shuffle Items
    </button>

    <button onClick={() => onRotate()} style={styles.button}>
      Rotate Items
    </button>
  </div>
);

Controls.propTypes = {
  onRemove: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onRotate: PropTypes.func.isRequired,
  onShuffle: PropTypes.func.isRequired,
  numOfCurrentItems: PropTypes.number.isRequired,
  numOfTotalItems: PropTypes.number.isRequired,
};

export default Controls;
