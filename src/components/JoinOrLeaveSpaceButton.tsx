import React from 'react';
import { ButtonHandler } from '../types';
import { LEAVE_SPACE } from '../state/consts';
import { joinSpace, leaveSpace, Space } from '../api/spaces';
import { joinSpace as makeJoinSpace, LeaveSpace } from '../state/actions';
import { useDispatch, useJoinedMap } from './App';
import { throwAppError } from '../helper/fetch';

interface Props {
  space: Space;
}

export const JoinOrLeaveSpaceButton: React.FC<Props> = ({ space }) => {
  const joined = useJoinedMap();
  const dispatch = useDispatch();

  const handleJoin: ButtonHandler = async () => {
    const member = await throwAppError(dispatch, await joinSpace(space.id));
    dispatch(makeJoinSpace(space, member));
  };

  const handleLeave: ButtonHandler = async () => {
    const spaceId = space.id;
    const leaveResult = await leaveSpace(spaceId);
    if (leaveResult.ok) {
      dispatch<LeaveSpace>({
        tag: LEAVE_SPACE,
        spaceId,
      });
    }
  };
  if (joined.has(space.id)) {
    return <button onClick={handleLeave}>退出</button>;
  } else {
    return <button onClick={handleJoin}>加入</button>;
  }
};
