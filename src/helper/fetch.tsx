import { LOADING } from '../consts';
import React, { DependencyList, ReactElement, useCallback, useEffect, useState } from 'react';
import { AppError, AppResult, errorText } from '../api/client';
import { Dispatcher } from '../types';
import { errorInfo } from '../state/actions';
import { MessageBar, MessageBarType, Spinner, SpinnerSize } from 'office-ui-fabric-react';

export const useFetch = <T,>(f: () => Promise<T>, deps: DependencyList): [T | LOADING, () => void] => {
  const [result, setResult] = useState<T | LOADING>(LOADING);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    f().then(setResult);
  }, deps.concat(trigger));

  const refetch = useCallback(() => {
    setTrigger(!trigger);
  }, deps.concat(trigger));

  return [result, refetch];
};

export interface Render<T> {
  className: string;
  fetch: () => Promise<AppResult<T>>;
  render: (value: T, refetch: () => void) => ReactElement | null;
  onError?: (err: AppError) => ReactElement | null;
  onLoading?: ReactElement;
}

export const useRender = <T,>(
  { className, fetch, render, onError, onLoading }: Render<T>,
  deps: DependencyList
): React.ReactElement | null => {
  const [result, refetch] = useFetch(fetch, deps);
  let inner: ReactElement | null = null;
  if (result === LOADING) {
    className += ' on-loading';
    if (onLoading) {
      inner = onLoading;
    } else {
      inner = <Spinner label="载入中…" size={SpinnerSize.medium} />;
    }
  } else if (result.ok) {
    className += ' on-success';
    inner = render(result.some, refetch);
  } else if (!result.ok) {
    className += ' on-error';
    if (onError) {
      inner = onError(result.err);
    } else {
      inner = (
        <MessageBar messageBarType={MessageBarType.error} isMultiline>
          {errorText(result.err)}
        </MessageBar>
      );
    }
  }
  return <div className={className}>{inner}</div>;
};

export const throwAppError = <T,>(dispatch: Dispatcher, result: AppResult<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    if (result.ok) {
      resolve(result.some);
    } else {
      dispatch(errorInfo(errorText(result.err)));
      reject(result.err);
    }
  });
