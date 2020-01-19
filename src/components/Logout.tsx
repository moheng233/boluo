import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useMe } from './App';
import { logout } from '../state/actions';
import { get } from '../api/client';

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

  return (
    <div className="Logout">
      <h1>登出中…</h1>
    </div>
  );
};
