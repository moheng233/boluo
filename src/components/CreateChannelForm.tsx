import React, { FormEventHandler, useState } from 'react';
import { InputChangeHandler } from '../types';
import { CreateChannel, JoinedChannel } from '../api/channels';
import { post } from '../api/client';
import { throwAppError } from '../helper/fetch';
import { useDispatch } from './App';
import { JoinChannel } from '../state/actions';
import { JOIN_CHANNEL } from '../state/consts';

interface Props {
  spaceId: string;
  close: () => void;
}

export const CreateChannelForm: React.FC<Props> = ({ spaceId, close }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();

    const createResult = await post<JoinedChannel, CreateChannel>('/channels/create', { spaceId, name });
    const joined = await throwAppError(dispatch, createResult);
    dispatch<JoinChannel>({ tag: JOIN_CHANNEL, joined });
    close();
  };

  const handleName: InputChangeHandler = e => {
    setName(e.target.value);
  };
  return (
    <form className="CreateChannelForm" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="new-channel-name">频道名</label>
        <input name="new-channel-name" value={name} onChange={handleName} />
      </div>
      <button type="button" onClick={close}>
        取消
      </button>
      <button type="submit">创建</button>
    </form>
  );
};
