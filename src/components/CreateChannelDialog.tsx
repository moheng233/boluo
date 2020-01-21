import React, { useState } from 'react';
import {
  DefaultButton,
  Dialog,
  DialogContent,
  DialogFooter,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
} from 'office-ui-fabric-react';
import { TextFieldOnChange } from '../types';
import { checkDisplayName, getErrorMessage } from '../validators';
import { errorCodeIs, errorText, post } from '../api/client';
import { CreateChannel, JoinedChannelData } from '../api/channels';
import { throwAppError } from '../helper/fetch';
import { JoinChannel } from '../state/actions';
import { CONFLICT, JOIN_CHANNEL, VALIDATION_FAIL } from '../consts';
import { useDispatch } from './App';
import { Space } from '../api/spaces';

interface Props {
  space: Space;
  isOpen: boolean;
  close: () => void;
  refetch: () => void;
}

export const CreateChannelDialog: React.FC<Props> = ({ space, isOpen, close, refetch }) => {
  const spaceId = space.id;
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const dismissError = () => setError('');

  const handleName: TextFieldOnChange = (_, value) => {
    value = value || '';
    setNameError(getErrorMessage(checkDisplayName(value || '')));
    setName(value);
  };

  const submit = async () => {
    dismissError();
    const result = await post<JoinedChannelData, CreateChannel>('/channels/create', { spaceId, name });
    let nextError = '';
    if (result.err?.code === CONFLICT) {
      nextError = `已经存在名叫「${name}」的频道了。`;
    } else if (!result.ok) {
      nextError = errorText(result.err);
    } else {
      const joined = result.some;
      dispatch<JoinChannel>({ tag: JOIN_CHANNEL, joined });
      close();
      refetch();
      return;
    }
    setError(nextError);
  };

  const isDisabled = name.length === 0 || nameError.length > 0;

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={close}
      dialogContentProps={{
        title: '创建新频道',
      }}
    >
      <DialogContent>
        {error.length > 0 ? (
          <MessageBar messageBarType={MessageBarType.error} onDismiss={dismissError}>
            {error}
          </MessageBar>
        ) : null}
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
