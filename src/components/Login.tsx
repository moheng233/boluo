import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { login, setMe } from '../api/users';
import { errorHandle } from '../api/client';
import { ErrorMessage } from './ErrorMessage';

type InputChange = React.ChangeEventHandler<HTMLInputElement>;

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onUsernameChange: InputChange = e => setUsername(e.target.value);
  const onPasswordChange: InputChange = e => setPassword(e.target.value);

  const history = useHistory();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const me = await login(username, password);
    if (me.ok) {
      setMe(me.some.user);
      history.push('/');
    } else if (me.err.code === 'NO_PERMISSION') {
      setErrorMessage('登录失败，请检查您的用户名和密码');
    } else {
      setErrorMessage(errorHandle(me.err));
    }
  };

  return (
    <main className="Login">
      <header>
        <Link to="/">菠萝</Link>
        <h1>登录</h1>
        <p>菠萝菠萝哒!</p>
      </header>
      <form onSubmit={onSubmit} className="login-form">
        <ErrorMessage message={errorMessage} />
        <p className="field">
          <label htmlFor="username">用户名:</label>
          <input id="username" value={username} onChange={onUsernameChange} />
        </p>
        <p className="field">
          <label htmlFor="password">密码:</label>
          <input id="password" type="password" value={password} onChange={onPasswordChange} />
        </p>
        <p className="field">
          <button className="submit" type="submit">
            登录
          </button>
        </p>
      </form>
      <p className="no-account-yet">
        还没有菠萝菠萝账号？<Link to="/register">点这里注册吧</Link>。
      </p>
    </main>
  );
};
