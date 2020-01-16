import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ErrorMessage } from './ErrorMessage';
import { checkEmailFormat, checkName, checkPassword, checkUsername, ValidatorResult } from '../validators';
import { InputChangeHandler } from '../utils';
import { register } from '../api/users';
import { errorHandle } from '../api/client';

const handlerMaker = (
  setValue: (value: string) => void,
  setError: (message: string) => void,
  checker: (value: string) => ValidatorResult
): InputChangeHandler => e => {
  const { value } = e.target;
  setValue(value);
  const checkResult = checker(value);
  if (value.length === 0 || checkResult.ok) {
    setError('');
  } else {
    setError(checkResult.err);
  }
};

export const Register = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [passwordRepeatError, setPasswordRepeatError] = useState('');

  const usernameHandler: InputChangeHandler = handlerMaker(setUsername, setUsernameError, checkUsername);

  const emailHandler: InputChangeHandler = handlerMaker(setEmail, setEmailError, checkEmailFormat);

  const nicknameHandler: InputChangeHandler = handlerMaker(setNickname, setNicknameError, checkName);

  const passwordHandler: InputChangeHandler = handlerMaker(setPassword, setPasswordError, checkPassword);

  const passwordRepeatHandler: InputChangeHandler = e => {
    const { value } = e.target;
    setPasswordRepeat(value);
    if (value !== password) {
      setPasswordRepeatError('两次输入的密码不相同');
    } else if (passwordRepeatError.length > 0) {
      setPasswordRepeatError('');
    }
  };

  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    const registerResult = await register(email, username, password, nickname);
    if (registerResult.ok) {
      history.push('/login');
    } else {
      const { err } = registerResult;
      if (err.code === 'ALREADY_EXISTS') {
        setRegisterError('已经存在这个用户名或者邮箱，也许您注册过了？');
      } else if (err.code === 'VALIDATION_FAIL') {
        setRegisterError(err.message);
      } else {
        const message = errorHandle(registerResult.err);
        setRegisterError(message);
      }
    }
  };

  return (
    <main className="Register">
      <header>
        <Link to="/">菠萝</Link>
        <h1>注册</h1>
        <p>享用酸甜可口的菠萝吧。</p>
      </header>
      <form className="register-form" onSubmit={handleSubmit}>
        <ErrorMessage message={registerError} />
        <p className="field">
          <label htmlFor="username">用户名:</label>
          <input id="username" value={username} onChange={usernameHandler} />
        </p>
        <ErrorMessage message={usernameError} />
        <p className="field">
          <label htmlFor="email">邮箱:</label>
          <input id="email" value={email} onChange={emailHandler} />
        </p>
        <ErrorMessage message={emailError} />
        <p className="field">
          <label htmlFor="nickname">昵称:</label>
          <input id="nickname" value={nickname} onChange={nicknameHandler} />
        </p>
        <ErrorMessage message={nicknameError} />
        <p className="field">
          <label htmlFor="password">密码:</label>
          <input id="password" type="password" value={password} onChange={passwordHandler} />
        </p>
        <ErrorMessage message={passwordError} />
        <p className="field">
          <label htmlFor="password-repeat">重复密码:</label>
          <input id="password-repeat" type="password" value={passwordRepeat} onChange={passwordRepeatHandler} />
        </p>
        <ErrorMessage message={passwordRepeatError} />
        <p>
          <button type="submit">注册</button>
        </p>
      </form>
      <p className="had-account">
        已经有账号了？<Link to="/login">登录</Link>。
      </p>
    </main>
  );
};
