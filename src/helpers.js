/**
 * React Flip Move
 * (c) 2016-present Joshua Comeau
 */

export function convertToInt(val) {
  return typeof val === 'string' ? parseInt(val) : val
}

export function convertAllToInt(...values) {
  return values.map(convertToInt);
}

// Modified from Modernizr
export function whichTransitionEvent() {
  const transitions = {
    'transition':       'transitionend',
    'OTransition':      'oTransitionEnd',
    'MozTransition':    'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  }

  // If we're running in a browserless environment (eg. SSR), it doesn't apply.
  // Return a string so that it maintains the type that is expected.
  if ( typeof document === 'undefined' ) return '';

  const el = document.createElement('fakeelement');

  for ( let t in transitions ) {
    if ( el.style[t] !== undefined ) return transitions[t];
  }
}
