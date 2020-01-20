import React, { useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { checkEmailFormat, checkName, checkPassword, checkUsername, ValidatorResult } from '../validators';
import { TextFieldOnChange } from '../types';
import { register } from '../api/users';
import { useDispatch, useMe } from './App';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import { errorInfo } from '../state/actions';
import { throwAppError } from '../helper/fetch';

const handlerMaker = (
  setValue: (value: string) => void,
  setError: (message: string) => void,
  checker: (value: string) => ValidatorResult
): TextFieldOnChange => (e, value) => {
  if (value === undefined) {
    return;
  }
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
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordRepeatError, setPasswordRepeatError] = useState('');
  const me = useMe();

  if (me !== null) {
    return <Redirect to="/" />;
  }

  const usernameHandler: TextFieldOnChange = handlerMaker(setUsername, setUsernameError, checkUsername);

  const emailHandler: TextFieldOnChange = handlerMaker(setEmail, setEmailError, checkEmailFormat);

  const nicknameHandler: TextFieldOnChange = handlerMaker(setNickname, setNicknameError, checkName);

  const passwordHandler: TextFieldOnChange = handlerMaker(setPassword, setPasswordError, checkPassword);

  const someEmpty = [username, password, email, nickname, passwordRepeat].some(e => e.length === 0);
  const someError = [usernameError, emailError, nicknameError, passwordError, passwordRepeatError].some(
    e => e.length > 0
  );
  const isDisabled = someError || someEmpty;

  const passwordRepeatHandler: TextFieldOnChange = (e, value) => {
    if (value === undefined) {
      return;
    }
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
        dispatch(errorInfo('已经存在这个用户名或者邮箱，也许您注册过了？'));
      } else if (err.code === 'VALIDATION_FAIL') {
        dispatch(errorInfo(err.message));
      } else {
        await throwAppError(dispatch, registerResult);
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
        <TextField label="用户名" value={username} onChange={usernameHandler} errorMessage={usernameError} required />
        <TextField label="邮箱" type="email" value={email} onChange={emailHandler} errorMessage={emailError} required />
        <TextField label="昵称" value={nickname} onChange={nicknameHandler} errorMessage={nicknameError} required />
        <TextField
          label="密码"
          type="password"
          value={password}
          onChange={passwordHandler}
          errorMessage={passwordError}
          required
        />
        <TextField
          label="重复密码"
          type="password"
          value={passwordRepeat}
          onChange={passwordRepeatHandler}
          errorMessage={passwordRepeatError}
          required
        />
        <PrimaryButton text="注册" type="submit" disabled={isDisabled} />
      </form>
      <p className="had-account">
        已经有账号了？<Link to="/login">登录</Link>。
      </p>
    </div>
  );
};
