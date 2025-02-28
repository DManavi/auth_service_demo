import { defaultTo } from 'lodash';
import * as typeChecks from './type-check';

/**
 * Type assertion functions are a new feature in TypeScript 3.7.
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
 */

/**
 * Creates an error object if the provided value is a string, otherwise throws the provided error object.
 * @param errorOrMessage Error object or message to throw
 * @returns
 */
function createOrThrowError(errorOrMessage: string | Error) {
  if (typeof errorOrMessage === 'string') {
    throw new Error(errorOrMessage);
  }

  throw errorOrMessage;
}

/**
 * Asserts that a value is not null.
 * @param val Value to check
 * @param errorOrMessage Error object or message to throw if the value is null
 */
export function isNotNull<T = unknown>(
  val?: T,
  errorOrMessage?: string | Error
): asserts val is NonNullable<T> {
  if (typeChecks.isNull(val) === true) {
    createOrThrowError(defaultTo(errorOrMessage, 'Value is null'));
  }
}

/**
 * Asserts that a value is null.
 * @param val Value to check
 * @param errorOrMessage Error object or message to throw if the value is not null
 */
export function IsNull<T = unknown>(
  val?: T | null,
  errorOrMessage?: string | Error
): asserts val is null {
  if (val !== null) {
    createOrThrowError(defaultTo(errorOrMessage, 'Value is not null'));
  }
}

/**
 * Asserts that a value is not undefined.
 * @param val Value to check
 * @param errorOrMessage Error object or message to throw if the value is undefined
 */
export function isNotUndefined<T = unknown>(
  val?: T,
  errorOrMessage?: string | Error
): asserts val is NonNullable<T> {
  if (typeChecks.isUndefined(val) === true) {
    createOrThrowError(defaultTo(errorOrMessage, 'Value is undefined'));
  }
}

/**
 * Asserts that a value is undefined.
 * @param val Value to check
 * @param errorOrMessage Error object or message to throw if the value is not undefined
 */
export function isUndefined<T = unknown>(
  val?: T,
  errorOrMessage?: string | Error
): asserts val is undefined {
  if (val !== undefined) {
    createOrThrowError(defaultTo(errorOrMessage, 'Value is not undefined'));
  }
}

/**
 * Asserts that a value is not null or undefined.
 * @param val Value to check
 * @param errorOrMessage Error object or message to throw if the value is null or undefined
 */
export function isNotNullOrUndefined<T = unknown>(
  val?: T,
  errorOrMessage?: string | Error
): asserts val is NonNullable<T> {
  if (
    typeChecks.isNull(val) === true ||
    typeChecks.isNullOrUndefined(val) === true
  ) {
    createOrThrowError(
      defaultTo(errorOrMessage, 'Value is either null or undefined')
    );
  }
}

/**
 * This function calls `isNotNullOrUndefined` and is used to assert that a value is defined.
 */
export function isDefined<T = unknown>(
  val?: T,
  errorOrMessage?: string | Error
): asserts val is NonNullable<T> {
  isNotNullOrUndefined(val, errorOrMessage);
}

/**
 * Asserts that a value is null or undefined.
 * @param val Value to check
 * @param errorOrMessage Error object or message to throw if the value is not null or undefined
 */
export function IsNotDefined<T = unknown>(
  val?: T | null,
  errorOrMessage?: string | Error
): asserts val is null | undefined {
  if (typeChecks.isNullOrUndefined(val) === false) {
    createOrThrowError(
      defaultTo(errorOrMessage, 'Value is neither null nor undefined')
    );
  }
}

/**
 * Asserts that a value is equal to a specific value.
 * @param val Value to check
 * @param expected Expected value
 * @param errorOrMessage Error object or message to throw if the value is not equal to the expected value
 */
export function isEqual<T = unknown>(
  val: T,
  expected: T,
  errorOrMessage?: string | Error
): asserts val is T {
  if (val !== expected) {
    createOrThrowError(
      defaultTo(errorOrMessage, `Value is not equal to ${expected}`)
    );
  }
}

/**
 * Asserts that a value is not equal to a specific value.
 * @param val Value to check
 * @param expected Expected value
 * @param errorOrMessage Error object or message to throw if the value is equal to the expected value
 */
export function isNotEqual<T = unknown>(
  val: T,
  expected: T,
  errorOrMessage?: string | Error
): asserts val is T {
  if (val === expected) {
    createOrThrowError(
      defaultTo(errorOrMessage, `Value is equal to ${expected}`)
    );
  }
}

/**
 * Asserts that a value is one of the provided values.
 * @param val Value to check
 * @param values Array of allowed values
 * @param errorOrMessage Error object or message to throw if the value is not one of the allowed values
 */
export function isOneOf<T = unknown>(
  val: T,
  values: T[],
  errorOrMessage?: string | Error
): asserts val is T {
  for (const value of values) {
    if (val === value) {
      return;
    }
  }

  createOrThrowError(
    defaultTo(
      errorOrMessage,
      `Value is not one of the allowed values: ${values.join(', ')}`
    )
  );
}

export function isTrue(
  val: boolean,
  errorOrMessage?: string | Error
): asserts val is true {
  if (val !== true) {
    createOrThrowError(defaultTo(errorOrMessage, 'Value is not true'));
  }
}

export function isFalse(
  val: boolean,
  errorOrMessage?: string | Error
): asserts val is false {
  if (val !== false) {
    createOrThrowError(defaultTo(errorOrMessage, 'Value is not false'));
  }
}
