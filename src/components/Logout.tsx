import React from 'react';
import { clearMe } from '../api/users';
import { clearCsrfToken, get } from '../api/client';
import { useHistory } from 'react-router-dom';

export const Logout = () => {
  const history = useHistory();
  clearMe();
  clearCsrfToken();
  get('users/logout', {}).then(() => history.push('/'));
  return (
    <main>
      <h1>Logout</h1>
    </main>
  );
};
