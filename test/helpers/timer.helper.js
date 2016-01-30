/**
 * Super simple timer util.
 * Precise to within ~10ms.
 */

export const createTimer = function() {
  let _start, _end, _result;

  return {
    start() {
      _start = +new Date();
    },
    end() {
      _end = +new Date();
      _result = _end - _start;
      return _result;
    },
    reset() {
      _start  = null;
      _end    = null;
      _result = null;
    },

    get result() {
      return _result;
    }
  }
}
