// eslint-disable-next-line import/prefer-default-export
export const isElementAnSFC = (element) => {
  // account for null/undefined/false children.
  if (!element) {
    return false;
  }

  const isNativeDOMElement = typeof element.type === 'string';

  if (isNativeDOMElement) {
    return false;
  }

  return !element.type.prototype.isReactComponent;
};
