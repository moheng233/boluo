export interface Ok<T> {
  ok: true;
  some: T;
  err?: undefined;
}

export interface Err<E> {
  ok: false;
  err: E;
  some?: undefined;
}

export type Result<T, E> = Ok<T> | Err<E>;

export const Result = {
  Ok: <T>(some: T): Ok<T> => ({ ok: true, some }),

  Err: <E>(err: E): Err<E> => ({ ok: false, err }),

  map: <T, U, E>(result: Result<T, E>, mapper: (t: T) => U): Result<U, E> => {
    if (result.ok) {
      return { ok: true, some: mapper(result.some) };
    } else {
      return result;
    }
  },

  andThen: <T, U, E>(result: Result<T, E>, mapper: (t: T) => Result<U, E>): Result<U, E> => {
    if (result.ok) {
      return mapper(result.some);
    } else {
      return result;
    }
  },

  isOk: <T, E>(result: Result<T, E>): result is Ok<T> => {
    return result.ok;
  },

  isErr: <T, E>(result: Result<T, E>): result is Err<E> => {
    return !result.ok;
  },

  throwErr: <T, E, Ex extends Error>(constructor: new (e: E) => Ex, result: Result<T, E>): T => {
    if (!result.ok) {
      throw new constructor(result.err);
    }
    return result.some;
  },

  mapErr: <T, E1, E2>(result: Result<T, E1>, mapper: (e: E1) => E2): Result<T, E2> => {
    if (result.ok) {
      return result;
    } else {
      return { ok: false, err: mapper(result.err) };
    }
  },

  unwrap: <T, E>(result: Result<T, E>): T => {
    if (!result.ok) {
      throw new Error(String(result.err));
    } else {
      return result.some;
    }
  },
};
