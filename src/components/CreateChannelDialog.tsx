import React, { useState } from 'react';
import { DefaultButton, Dialog, DialogContent, DialogFooter, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { TextFieldOnChange } from '../types';
import { checkName } from '../validators';
import { errorCodeIs, post } from '../api/client';
import { CreateChannel, JoinedChannel } from '../api/channels';
import { throwAppError } from '../helper/fetch';
import { JoinChannel } from '../state/actions';
import { JOIN_CHANNEL } from '../consts';
import { useDispatch } from './App';

interface Props {
  spaceId: string;
  isOpen: boolean;
  close: () => void;
}

export const CreateChannelDialog: React.FC<Props> = ({ spaceId, isOpen, close }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const dispatch = useDispatch();

  const handleName: TextFieldOnChange = (_, value) => {
    const checkResult = checkName(value || '');
    if (!checkResult.ok) {
      setNameError(checkResult.err);
    } else {
      setNameError('');
    }
    setName(value || '');
  };

  const submit = async () => {
    const result = await post<JoinedChannel, CreateChannel>('/channels/create', { spaceId, name });
    if (errorCodeIs(result, 'ALREADY_EXISTS')) {
      setNameError(`已经存在名叫「${name}」的频道了。`);
      return;
    }
    const joined = await throwAppError(dispatch, result);
    dispatch<JoinChannel>({ tag: JOIN_CHANNEL, joined });
    close();
  };

  const isDisabled = name.length === 0 || nameError.length > 0;

  return (
    <Dialog
      hidden={!isOpen}
      dialogContentProps={{
        title: '创建新频道',
      }}
    >
      <DialogContent>
        <TextField label="频道名" value={name} onChange={handleName} errorMessage={nameError} required />
      </DialogContent>
      <DialogFooter>
        <DefaultButton onClick={close}>取消</DefaultButton>
        <PrimaryButton onClick={submit} disabled={isDisabled}>
          创建
        </PrimaryButton>
      </DialogFooter>
    </Dialog>
  );
};
