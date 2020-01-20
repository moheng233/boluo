import React, { useState } from 'react';
import { useJoinedMap, useMe } from './App';
import { DefaultButton } from 'office-ui-fabric-react';
import { CreateChannelDialog } from './CreateChannelDialog';

interface Props {
  spaceId: string;
  refetch: () => void;
}

export const CreateChannelButton: React.FC<Props> = ({ spaceId, refetch }) => {
  const joinedMap = useJoinedMap();
  const me = useMe();
  const joined = joinedMap.get(spaceId, null);
  const [showDialog, setShowDialog] = useState(false);

  const openDialog = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    refetch();
  };

  if (joined === null || me === null) {
    return null;
  }
  const { space, member } = joined.space;
  if (space.ownerId !== me.id && !member.isAdmin) {
    return null;
  }

  return (
    <>
      <CreateChannelDialog spaceId={space.id} isOpen={showDialog} close={closeDialog} />
      <DefaultButton className="CreateChannelButton" onClick={openDialog}>
        创建频道
      </DefaultButton>
    </>
  );
};
