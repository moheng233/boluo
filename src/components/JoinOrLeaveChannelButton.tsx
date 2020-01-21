import React, { useState } from 'react';
import { ButtonHandler, TextFieldOnChange } from '../types';
import { JOIN_CHANNEL, LEAVE_CHANNEL } from '../consts';
import { JoinChannel, LeaveChannel } from '../state/actions';
import { useDispatch, useMySpaces } from './App';
import { throwAppError } from '../helper/fetch';
import {
  ActionButton,
  DefaultButton,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogType,
  IButtonProps,
  PrimaryButton,
  TextField,
  Text,
  MessageBar,
} from 'office-ui-fabric-react';
import * as Api from '../api/channels';
import { post } from '../api/client';
import { checkDisplayName, getErrorMessage } from '../validators';

interface Props {
  channel: Api.Channel;
}

export const JoinOrLeaveChannelButton: React.FC<Props> = ({ channel }) => {
  const mySpaces = useMySpaces();
  const dispatch = useDispatch();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterNameError, setCharacterNameError] = useState('');
  const { id } = channel;

  const handleCharacterName: TextFieldOnChange = (_, value) => {
    value = (value || '').trim();
    if (value.length > 0) {
      setCharacterNameError(getErrorMessage(checkDisplayName(value)));
    } else if (characterNameError.length > 0) {
      setCharacterNameError('');
    }
    setCharacterName(value);
  };

  const handleJoin: ButtonHandler = async () => {
    hideJoinDialog();
    const result = await post<Api.JoinedChannelData, Api.JoinChannel>('/channels/join', {
      channelId: channel.id,
      characterName,
    });
    const joinedChannel = await throwAppError(dispatch, result);
    dispatch<JoinChannel>({ tag: JOIN_CHANNEL, joined: joinedChannel });
  };

  const hideJoinDialog = () => setShowJoinDialog(false);
  const hideLeaveDialog = () => setShowLeaveDialog(false);

  const handleLeave: ButtonHandler = async () => {
    hideLeaveDialog();
    const leaveResult = await post<true>('/channels/leave', {}, { id });
    await throwAppError(dispatch, leaveResult);
    dispatch<LeaveChannel>({
      tag: LEAVE_CHANNEL,
      spaceId: channel.spaceId,
      channelId: channel.id,
    });
  };
  const joinedSpace = mySpaces.get(channel.spaceId);
  const spaceMember = joinedSpace?.member;
  const channelMember = joinedSpace?.channels.get(channel.id);
  const buttonProps: IButtonProps = {
    text: channelMember ? '离开频道' : '加入频道',
    onClick: () => (channelMember ? setShowLeaveDialog(true) : setShowJoinDialog(true)),
    iconProps: { iconName: channelMember ? 'leave' : 'join' },
  };
  return (
    <>
      <Dialog
        hidden={!showJoinDialog}
        onDismiss={hideJoinDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: '加入频道',
        }}
      >
        <DialogContent>
          {spaceMember ? null : <MessageBar>要加入这个频道，您必须首先是这个位面的成员。</MessageBar>}
          <TextField
            label="角色名"
            value={characterName}
            onChange={handleCharacterName}
            description="（选填）指定您在这个频道所扮演的角色名。"
            errorMessage={characterNameError}
            disabled={!spaceMember}
          />
        </DialogContent>
        <DialogFooter>
          <DefaultButton onClick={hideJoinDialog}>取消</DefaultButton>
          <PrimaryButton onClick={handleJoin} disabled={!spaceMember}>
            加入
          </PrimaryButton>
        </DialogFooter>
      </Dialog>
      <Dialog
        hidden={!showLeaveDialog}
        onDismiss={hideLeaveDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: '离开频道',
          subText: `您确定要离开「${channel.name}」频道吗？`,
        }}
      >
        <DialogFooter>
          <DefaultButton onClick={hideLeaveDialog}>取消</DefaultButton>
          <PrimaryButton onClick={handleLeave}>离开</PrimaryButton>
        </DialogFooter>
      </Dialog>
      <ActionButton {...buttonProps} />
    </>
  );
};
