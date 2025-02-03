export const isNull = (val: unknown): val is null => val === null;

export const isUndefined = (val: unknown): val is undefined =>
  typeof val === 'undefined' || val === undefined;

export const isNullOrUndefined = (val: unknown): val is null | undefined =>
  isNull(val) || isUndefined(val);

export const isDefined = <T = unknown>(val: T): val is NonNullable<T> =>
  isNullOrUndefined(val) === false;

export const isString = (val: unknown): val is string =>
  typeof val === 'string';
