import React, { useState } from 'react';
import { ButtonHandler } from '../types';
import { LEAVE_SPACE } from '../consts';
import { joinSpace, leaveSpace, Space } from '../api/spaces';
import { joinSpace as makeJoinSpace, LeaveSpace } from '../state/actions';
import { useDispatch, useMySpaces } from './App';
import { throwAppError } from '../helper/fetch';
import { ActionButton, DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from 'office-ui-fabric-react';

interface Props {
  space: Space;
}

export const JoinOrLeaveSpaceButton: React.FC<Props> = ({ space }) => {
  const joined = useMySpaces();
  const dispatch = useDispatch();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const handleJoin: ButtonHandler = async () => {
    hideLeaveDialog();
    const member = await throwAppError(dispatch, await joinSpace(space.id));
    dispatch(makeJoinSpace(space, member));
  };

  const hideLeaveDialog = () => {
    setShowLeaveDialog(false);
  };

  const handleLeave: ButtonHandler = async () => {
    const spaceId = space.id;
    await throwAppError(dispatch, await leaveSpace(spaceId));
    dispatch<LeaveSpace>({
      tag: LEAVE_SPACE,
      spaceId,
    });
  };

  if (joined.has(space.id)) {
    return (
      <>
        <Dialog
          hidden={!showLeaveDialog}
          onDismiss={hideLeaveDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: '离开位面',
            subText: `您确定要离开「${space.name}」位面吗？`,
          }}
        >
          <DialogFooter>
            <DefaultButton onClick={hideLeaveDialog}>取消</DefaultButton>
            <PrimaryButton onClick={handleLeave}>离开</PrimaryButton>
          </DialogFooter>
        </Dialog>
        <ActionButton iconProps={{ iconName: 'leave' }} onClick={() => setShowLeaveDialog(true)}>
          离开位面
        </ActionButton>
      </>
    );
  } else {
    return (
      <ActionButton iconProps={{ iconName: 'join' }} onClick={handleJoin}>
        加入位面
      </ActionButton>
    );
  }
};
