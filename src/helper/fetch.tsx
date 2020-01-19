import { LOADING } from '../state/consts';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { AppError, AppResult, errorHandle } from '../api/client';
import { Redirect } from 'react-router-dom';
import { Dispatcher } from '../types';
import { errorInfo } from '../state/actions';

export const useFetch = <T,>(f: () => Promise<T>): [T | LOADING, () => void] => {
  const [result, setResult] = useState<T | LOADING>(LOADING);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    f().then(setResult);
  }, [trigger]);

  const refetch = useCallback(() => setTrigger(!trigger), [trigger]);

  return [result, refetch];
};

export const renderFetchResult = <T,>(
  result: LOADING | AppResult<T>,
  render: (value: T) => ReactElement,
  loading?: ReactElement,
  onError?: (err: AppError) => ReactElement | null
): React.ReactElement => {
  if (result === LOADING) {
    return loading ? loading : <p className="loading">载入中…</p>;
  } else if (result.ok) {
    return render(result.some);
  }
  if (onError) {
    const errorElement = onError(result.err);
    if (errorElement) {
      return errorElement;
    }
  }
  if (result.err.code === 'UNAUTHENTICATED') {
    return <Redirect to="/login" />;
  }
  return <div className="app-error">{errorHandle(result.err)}</div>;
};

export const throwAppError = <T,>(dispatch: Dispatcher, result: AppResult<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    if (result.ok) {
      resolve(result.some);
    } else {
      dispatch(errorInfo(errorHandle(result.err)));
      reject(result.err);
    }
  });
