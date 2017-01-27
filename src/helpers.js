export const isElementAnSFC = (element) => {
  const isNativeDOMElement = typeof element.type === 'string';

  if (isNativeDOMElement) {
    return false;
  }

  return !element.type.prototype.isReactComponent;
};

export function omit(obj, attrs = []) {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (attrs.indexOf(key) === -1) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function arraysEqual(a, b) {
  const sameObject = a === b;
  if (sameObject) {
    return true;
  }

  const notBothArrays = !Array.isArray(a) || !Array.isArray(b);
  const differentLengths = a.length !== b.length;

  if (notBothArrays || differentLengths) {
    return false;
  }

  return a.every((element, index) => element === b[index]);
}
