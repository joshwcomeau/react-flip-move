// eslint-disable-next-line import/prefer-default-export
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
