export function convertToInt(...values) {
  return values.map( val => typeof val === 'string' ? parseInt(val) : val );
}

// Modified from Modernizr
export function whichTransitionEvent() {
  const el = document.createElement('fakeelement');

  const transitions = {
    'transition':       'transitionend',
    'OTransition':      'oTransitionEnd',
    'MozTransition':    'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  }

  for ( let t in transitions ) {
    if ( el.style[t] !== undefined ) return transitions[t];
  }
}
