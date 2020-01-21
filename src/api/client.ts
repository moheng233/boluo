import { Err, Result } from '../result';
import {
  BAD_REQUEST,
  ErrorCode,
  FETCH_FAIL,
  NO_PERMISSION,
  NOT_JSON,
  UNAUTHENTICATED,
  UNEXPECTED,
  VALIDATION_FAIL,
} from '../consts';

export interface AppError {
  code: ErrorCode;
  message: string;
  table: string | null;
}

const notJson: AppError = {
  code: 'NOT_JSON',
  message: 'The response body is not JSON',
  table: null,
};

export const fetchFail: AppError = {
  code: FETCH_FAIL,
  message: 'HTTP request failed',
  table: null,
};

export const errorText = (e: AppError): string => {
  switch (e.code) {
    case UNAUTHENTICATED:
      return '认证失败，需要登录';
    case NO_PERMISSION:
      return '您没有访问权限';
    case VALIDATION_FAIL:
      return `您的输入有误：${e.message}`;
    case FETCH_FAIL:
      return `遭遇到未知的网络错误`;
    case NOT_JSON:
      return '搞砸了! 服务器返回的消息格式有误，可能是服务器或者您的网络故障';
    case UNEXPECTED:
      return 'Oops! 服务器内部错误';
    case BAD_REQUEST:
      return `出错了! 请求格式有误: ${e.message}`;
    default:
      console.warn(e);
      return `发生了一个本该处理但未处理的错误: ${e.message}`;
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

export const request = async <T>(
  path: string,
  method: string,
  payload: object | null,
  csrf: boolean = true
): Promise<AppResult<T>> => {
  if (path[0] !== '/') {
    path = '/api/' + path;
  } else {
    path = '/api' + path;
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  if (csrf) {
    headers.append('csrf-token', await getCsrfToken());
  }
  let body: string | null;
  if (payload !== null) {
    body = JSON.stringify(payload);
  } else {
    body = null;
  }
  const result = await fetch(path, {
    method,
    headers,
    body,
    credentials: 'include',
  });
  try {
    return await result.json();
  } catch (e) {
    return Result.Err(notJson);
  }
};

export const clearCsrfToken = () => localStorage.removeItem(csrfKey);

interface Query {
  [key: string]: string | number | boolean | null;
}

const makePath = (path: string, query: Query): string => {
  const parts = [];
  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key];
      if (value !== null) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }
  return `${path}?${parts.join('&')}`;
};

export const post = <T, U extends object = object>(
  path: string,
  payload: U,
  query: Query = {},
  csrf: boolean = true
): Promise<AppResult<T>> => request(makePath(path, query), 'POST', payload, csrf);

export const get = <T>(path: string, query: Query = {}): Promise<AppResult<T>> => {
  return request(makePath(path, query), 'GET', null, false);
};

export function errorCodeIs<T>(result: AppResult<T>, errorCode: ErrorCode): boolean {
  return !result.ok && result.err.code === errorCode;
}
