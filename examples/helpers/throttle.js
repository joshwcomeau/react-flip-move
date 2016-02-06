/**
 * Throttle.
 * A very simple throttle function. Differs from traditional throttle
 * implementations in that it does NOT batch events.
 * For example, if it's set for 250ms, and it receives 5 events in that
 * window, it only fires once.
 * @param {Function} fn - the function to throttle
 * @param {Object} options:
 *   @param {Number} threshold - The maximum fire rate of the fn
 *   @param {Object} context - The `this` value that should be passed to fn
 * @returns {Function}
 */
export default function throttle(fn, { threshold = 200, context = window }) {
  let last;

  return function () {
    const now = +new Date;

    if ( !last || now >= (last + threshold) ) {
      last = now;
      fn.apply(context, arguments);
    }
  };
}
