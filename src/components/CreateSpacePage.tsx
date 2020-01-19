import React, { FormEventHandler, useState } from 'react';
import { InputChangeHandler } from '../types';
import { AppResult, post } from '../api/client';
import { CreateSpace, JoinedSpace } from '../api/spaces';
import { useDispatch } from './App';
import { JoinSpace } from '../state/actions';
import { JOIN_SPACE } from '../state/consts';
import { checkName } from '../validators';
import { useHistory } from 'react-router-dom';

interface Props {}

export const CreateSpacePage: React.FC<Props> = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();
    const joined: AppResult<JoinedSpace> = await post<JoinedSpace, CreateSpace>('/spaces/create', {
      name,
      password: null,
    });
    if (joined.ok) {
      dispatch<JoinSpace>({ tag: JOIN_SPACE, ...joined.some });
      history.push('/space/' + joined.some.space.id);
    }
  };

  const handleName: InputChangeHandler = async e => {
    const checkResult = checkName(name);
    if (!checkResult.ok) {
      setNameError(checkResult.err);
    } else if (checkResult.ok && nameError.length > 0) {
      setNameError('');
    }
    setName(e.target.value);
  };

  const isDisabled = name.length === 0 || nameError.length !== 0;

  return (
    <div className="CreateSpace">
      <header>
        <h1>创建位面</h1>
        <p>开辟新的天地</p>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">名称</label>
          <input id="name" value={name} onChange={handleName} />
        </div>
        <button disabled={isDisabled} type="submit">
          创建
        </button>
      </form>
    </div>
  );
};
