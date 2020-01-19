import React, { useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { FormError } from './FormError';
import { checkEmailFormat, checkName, checkPassword, checkUsername, ValidatorResult } from '../validators';
import { InputChangeHandler } from '../types';
import { register } from '../api/users';
import { errorHandle } from '../api/client';
import { useMe } from './App';

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

export const Register: React.FC = () => {
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
  const me = useMe();

  if (me !== null) {
    return <Redirect to="/" />;
  }

  const usernameHandler: InputChangeHandler = handlerMaker(setUsername, setUsernameError, checkUsername);

  const emailHandler: InputChangeHandler = handlerMaker(setEmail, setEmailError, checkEmailFormat);

  const nicknameHandler: InputChangeHandler = handlerMaker(setNickname, setNicknameError, checkName);

  const passwordHandler: InputChangeHandler = handlerMaker(setPassword, setPasswordError, checkPassword);

  const someEmpty = [username, password, email, nickname, passwordRepeat].some(e => e.length === 0);
  const someError = [usernameError, emailError, nicknameError, passwordError, passwordRepeatError].some(
    e => e.length > 0
  );
  const isDisabled = someError || someEmpty;

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
    if (isDisabled) {
      return;
    }
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
    <div className="Register">
      <header>
        <Link className="logo" to="/">
          菠萝
        </Link>
        <h1>注册</h1>
        <p>享用酸甜可口的菠萝吧</p>
      </header>
      <form className="register-form" onSubmit={handleSubmit}>
        <FormError message={registerError} />
        <div className="field">
          <label htmlFor="username">用户名</label>
          <input id="username" value={username} onChange={usernameHandler} />
          <FormError message={usernameError} />
        </div>
        <div className="field">
          <label htmlFor="email">邮箱</label>
          <input id="email" value={email} onChange={emailHandler} />
          <FormError message={emailError} />
        </div>
        <div className="field">
          <label htmlFor="nickname">昵称</label>
          <input id="nickname" value={nickname} onChange={nicknameHandler} />
          <FormError message={nicknameError} />
        </div>
        <div className="field">
          <label htmlFor="password">密码</label>
          <input id="password" type="password" value={password} onChange={passwordHandler} />
          <FormError message={passwordError} />
        </div>
        <div className="field">
          <label htmlFor="password-repeat">重复密码</label>
          <input id="password-repeat" type="password" value={passwordRepeat} onChange={passwordRepeatHandler} />
          <FormError message={passwordRepeatError} />
        </div>
        <div>
          <button type="submit" disabled={isDisabled}>
            注册
          </button>
        </div>
      </form>
      <p className="had-account">
        已经有账号了？<Link to="/login">登录</Link>。
      </p>
    </div>
  );
};
