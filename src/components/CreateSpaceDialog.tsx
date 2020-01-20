import React, { useState } from 'react';
import { DefaultButton, Dialog, DialogContent, DialogFooter, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { TextFieldOnChange } from '../types';
import { checkName } from '../validators';
import { AppResult, errorCodeIs, post } from '../api/client';
import { CreateSpace, JoinedSpace } from '../api/spaces';
import { JoinSpace } from '../state/actions';
import { JOIN_SPACE } from '../consts';
import { useDispatch } from './App';
import { throwAppError } from '../helper/fetch';
import { useHistory } from 'react-router-dom';

interface Props {
  show: boolean;
  dismiss: () => void;
}

export const CreateSpaceDialog: React.FC<Props> = ({ show, dismiss }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const handleName: TextFieldOnChange = (_, value) => {
    value = value || '';
    const checkResult = checkName(value);
    if (!checkResult.ok) {
      setNameError(checkResult.err);
    } else {
      setNameError('');
    }
    setName(value);
  };

  const handleSubmit = async () => {
    const result: AppResult<JoinedSpace> = await post<JoinedSpace, CreateSpace>('/spaces/create', {
      name,
      password: null,
    });
    if (errorCodeIs(result, 'ALREADY_EXISTS')) {
      setNameError('叫做这个名字的位面已经存在了');
      return;
    }
    const joined = await throwAppError(dispatch, result);
    dispatch<JoinSpace>({ tag: JOIN_SPACE, ...joined });
    dismiss();
    history.push('/space/' + joined.space.id);
  };

  return (
    <Dialog
      hidden={!show}
      onDismiss={dismiss}
      dialogContentProps={{
        title: '创建新位面',
        subText: '位面是你们冒险发生的地方',
      }}
    >
      <DialogContent>
        <TextField label="位面名" value={name} onChange={handleName} errorMessage={nameError} required />
      </DialogContent>
      <DialogFooter>
        <DefaultButton onClick={dismiss}>取消</DefaultButton>
        <PrimaryButton onClick={handleSubmit}>创建</PrimaryButton>
      </DialogFooter>
    </Dialog>
  );
};
