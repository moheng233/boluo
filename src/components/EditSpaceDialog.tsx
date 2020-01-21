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
import { errorCodeIs, post } from '../api/client';
import { EditSpace } from '../state/actions';
import { CONFLICT, EDIT_SPACE } from '../consts';
import { useDispatch } from './App';
import { EditSpaceData, Space } from '../api/spaces';

interface Props {
  space: Space;
  isOpen: boolean;
  close: () => void;
  refetch: () => void;
}

export const EditSpaceDialog: React.FC<Props> = ({ space, isOpen, close, refetch }) => {
  const [name, setName] = useState(space.name);
  const [description, setDescription] = useState(space.description);
  const [nameError, setNameError] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleName: TextFieldOnChange = (_, value) => {
    value = value || '';
    value = value.trim();
    const checkResult = checkDisplayName(value);
    setNameError(getErrorMessage(checkResult));
    setName(value);
  };

  const handleDescription: TextFieldOnChange = (_, value) => {
    value = (value || '').trim();
    setDescription(value);
  };

  const submit = async () => {
    const newName: string | undefined = name === space.name || name.length === 0 ? undefined : name;
    const newDescription: string | undefined = description === space.description ? undefined : description;
    const result = await post<Space, EditSpaceData>('/spaces/edit', {
      spaceId: space.id,
      name: newName,
      description: newDescription,
    });
    if (errorCodeIs(result, CONFLICT)) {
      setError(`已经存在名叫「${name}」的位面了。`);
      return;
    } else if (!result.ok) {
      setError(result.err.message);
      return;
    }
    const editedSpace = result.some;
    dispatch<EditSpace>({ tag: EDIT_SPACE, space: editedSpace });
    close();
    refetch();
  };

  const isDisabled = name.length === 0 || nameError.length > 0;

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={close}
      dialogContentProps={{
        title: '编辑位面',
      }}
    >
      <DialogContent>
        {error.length > 0 ? <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar> : null}
        <TextField label="名字" value={name} onChange={handleName} errorMessage={nameError} />
        <TextField label="描述" value={description} onChange={handleDescription} multiline />
      </DialogContent>
      <DialogFooter>
        <DefaultButton onClick={close}>取消</DefaultButton>
        <PrimaryButton onClick={submit} disabled={isDisabled}>
          编辑
        </PrimaryButton>
      </DialogFooter>
    </Dialog>
  );
};
