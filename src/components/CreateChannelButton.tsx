import React, { useState } from 'react';
import { useJoinedMap, useMe } from './App';
import { ButtonHandler } from '../types';
import { CreateChannelForm } from './CreateChannelForm';

interface Props {
  spaceId: string;
  refetch: () => void;
}

export const CreateChannelButton: React.FC<Props> = ({ spaceId, refetch }) => {
  const joinedMap = useJoinedMap();
  const me = useMe();
  const joined = joinedMap.get(spaceId, null);
  const [start, setStart] = useState(false);

  const handleCreate: ButtonHandler = () => {
    setStart(true);
  };

  const handleClose = () => {
    setStart(false);
    refetch();
  };

  if (start && joined !== null) {
    return <CreateChannelForm close={handleClose} spaceId={spaceId} />;
  }

  if (joined !== null) {
    const { space, member } = joined.space;
    if (space.ownerId === me?.id || member.isAdmin) {
      return (
        <button className="CreateChannelButton" onClick={handleCreate}>
          创建频道
        </button>
      );
    }
  }
  return null;
};
