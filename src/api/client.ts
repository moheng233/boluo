import { Result } from '../result';

export interface AppError {
  code: string;
  message: string;
}

export type AppResult<T> = Result<T, AppError>;

const csrfKey = 'csrf-token';

const isTimeout = (token: string): boolean => {
  const matched = token.match(/\.(\d+)\./);
  if (!matched) {
    return true;
  }
  const expire = parseInt(matched[1], 10);
  const now = new Date().getTime() / 1000;
  return expire < now;
};

const getCsrfToken = async (): Promise<string> => {
  const csrfToken: string | null = localStorage.getItem(csrfKey);
  if (csrfToken == null || isTimeout(csrfToken)) {
    return refreshCsrfToken();
  }
  return csrfToken;
};

const refreshCsrfToken = async (): Promise<string> => {
  const fetched = await fetch('/api/csrf-token', { credentials: 'include' });
  const csrfResult: AppResult<string> = await fetched.json();
  if (csrfResult.ok) {
    localStorage.setItem(csrfKey, csrfResult.some);
    return csrfResult.some;
  } else {
    throw new Error(csrfResult.err.message);
  }
};

export const request = async <T>(path: string, method: string, payload: object | null): Promise<AppResult<T>> => {
  path = '/api' + path;
  const csrfToken = await getCsrfToken();
  let body: string | null;
  if (payload !== null) {
    body = JSON.stringify(payload);
  } else {
    body = null;
  }
  let result = await fetch(path, {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      'csrf-token': csrfToken,
    }),
    body,
    credentials: 'include',
  });
  return await result.json();
};

export const post = <T>(path: string, payload: object): Promise<AppResult<T>> => request(path, 'POST', payload);

type Query = { [key: string]: string | number | boolean | null };

export const get = <T>(path: string, query: Query): Promise<AppResult<T>> => {
  const parts = [];
  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key];
      if (value !== null) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }
  return request(`${path}?${parts.join('&')}`, 'GET', null);
};
