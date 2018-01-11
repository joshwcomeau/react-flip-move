// @flow
import type { Element } from 'react';

export const find = <T>(
  predicate: (T, number, T[]) => boolean,
  arr: T[],
): ?T => {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) {
      return arr[i];
    }
  }

  return undefined;
};

export const every = <T>(
  predicate: (T, number, T[]) => boolean,
  arr: T[],
): boolean => {
  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i, arr)) {
      return false;
    }
  }
  return true;
};

// eslint-disable-next-line import/no-mutable-exports
export let isArray = (arr: mixed): boolean => {
  isArray =
    Array.isArray ||
    (arg => Object.prototype.toString.call(arg) === '[object Array]');
  return isArray(arr);
};

export const isElementAnSFC = (element: Element<*>): boolean => {
  const isNativeDOMElement = typeof element.type === 'string';

  if (isNativeDOMElement) {
    return false;
  }

  return !element.type.prototype.isReactComponent;
};

export function omit<R: {}, T: R>(obj: T, attrs: Array<$Keys<T>> = []): R {
  const result: $Shape<T> = {};
  Object.keys(obj).forEach((key: $Keys<T>) => {
    if (attrs.indexOf(key) === -1) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function arraysEqual<T>(a: Array<T>, b: Array<T>) {
  const sameObject = a === b;
  if (sameObject) {
    return true;
  }

  const notBothArrays = !isArray(a) || !isArray(b);
  const differentLengths = a.length !== b.length;

  if (notBothArrays || differentLengths) {
    return false;
  }

  return every((element, index) => element === b[index], a);
}

function memoizeString<T>(fn: string => T): string => T {
  const cache: { [string]: T } = {};

  return str => {
    if (!cache[str]) {
      cache[str] = fn(str);
    }
    return cache[str];
  };
}

export const hyphenate = memoizeString(str =>
  str.replace(/([A-Z])/g, '-$1').toLowerCase(),
);
