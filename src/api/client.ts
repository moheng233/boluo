import { Result } from '../result';

export interface AppError {
  code: string;
  message: string;
}

const notJson: AppError = {
  code: 'NOT_JSON',
  message: 'The response body is not JSON',
};

export const errorHandle = (e: AppError): string => {
  switch (e.code) {
    case 'UNAUTHENTICATED':
      window.setTimeout(() => (window.location.pathname = '/login'), 1000);
      return '页面需要登录，你将跳转到登录页面';
    case 'NO_PERMISSION':
      return '你没有访问权限';
    case 'NOT_JSON':
      return '搞砸了! 服务器返回的消息格式有误，可能是服务器或者您的网络故障';
    case 'UNEXPECTED':
      return 'Oops! 服务器内部错误';
    case 'BAD_REQUEST':
      return '出错了! 请求格式有误';
    default:
      console.warn(e);
      return '发生了一个本该处理但未处理的错误';
  }
};

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
  const result = await fetch(path, {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      'csrf-token': csrfToken,
    }),
    body,
    credentials: 'include',
  });
  try {
    return await result.json();
  } catch (e) {
    return Result.Err(notJson);
  }
};

export const post = <T>(path: string, payload: object): Promise<AppResult<T>> => request(path, 'POST', payload);

export const clearCsrfToken = () => localStorage.removeItem(csrfKey);

interface Query {
  [key: string]: string | number | boolean | null;
}

export const get = <T>(path: string, query: Query): Promise<AppResult<T>> => {
  const parts = [];
  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key];
      if (value !== null) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }
  return request(`${path}?${parts.join('&')}`, 'GET', null);
};
