import React, { useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { login } from '../api/users';
import { useDispatch, useMe } from './App';
import { errorInfo, login as makeLogin } from '../state/actions';
import { throwAppError } from '../helper/fetch';
import { fetchJoined } from '../api/spaces';

type InputChange = React.ChangeEventHandler<HTMLInputElement>;

interface Params {
  next?: string;
}

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { next } = useParams<Params>();
  const me = useMe();
  const redirectTo: string = next || '/';

  if (me) {
    return <Redirect to={redirectTo} />;
  }

  const onUsernameChange: InputChange = e => setUsername(e.target.value);
  const onPasswordChange: InputChange = e => setPassword(e.target.value);

  const isDisabled = [username, password].some(s => s.length === 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) {
      return;
    }
    const meResult = await login(username, password);
    if (!meResult.ok && meResult.err.code === 'NO_PERMISSION') {
      dispatch(errorInfo('登录失败，请检查您的用户名和密码'));
      return;
    }
    const me = await throwAppError(dispatch, meResult);
    dispatch(makeLogin(me.user));
    await fetchJoined(dispatch);
  };

  return (
    <div className="Login">
      <header>
        <Link className="logo" to="/">
          菠萝
        </Link>
        <h1>登录</h1>
      </header>
      <form onSubmit={onSubmit} className="login-form">
        <p className="field">
          <label htmlFor="username">用户名</label>
          <input id="username" value={username} onChange={onUsernameChange} />
        </p>
        <div className="field">
          <label htmlFor="password">密码</label>
          <input id="password" type="password" value={password} onChange={onPasswordChange} />
        </div>
        <div className="field">
          <button className="submit" type="submit" disabled={isDisabled}>
            登录
          </button>
        </div>
      </form>
      <div className="no-account-yet">
        还没有菠萝菠萝账号？<Link to="/register">点这里注册吧</Link>。
      </div>
    </div>
  );
};
