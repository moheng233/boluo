import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useMe } from './App';
import { logout } from '../state/actions';
import { get } from '../api/client';
import { ProgressIndicator } from 'office-ui-fabric-react';

export const Logout: React.FC = () => {
  const me = useMe();
  const dispatch = useDispatch();

  useEffect(() => {
    if (me !== null) {
      get('/users/logout').then(() => {
        dispatch(logout());
      });
    }
  }, [me]);

  if (me === null) {
    return <Redirect to="/" />;
  }

  return <ProgressIndicator label="登出中" />;
};
