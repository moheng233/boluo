import React, { useReducer, useState } from 'react';
import { DefaultButton } from 'office-ui-fabric-react';
import { IContextualMenuItem } from 'office-ui-fabric-react';
import { useMySpaces, useMe } from './App';
import { Space } from '../api/spaces';
import { CreateChannelDialog } from './CreateChannelDialog';
import { EditSpaceDialog } from './EditSpaceDialog';

interface Props {
  space: Space;
  refetch: () => void;
}

const NONE = 'NONE';
type NONE = typeof NONE;
const CREATE_CHANNEL_DIALOG = 'CREATE_CHANNEL_DIALOG';
type CREATE_CHANNEL_DIALOG = typeof CREATE_CHANNEL_DIALOG;
const EDIT_DIALOG = 'EDIT_DIALOG';
type EDIT_DIALOG = typeof EDIT_DIALOG;
type ManageState = NONE | CREATE_CHANNEL_DIALOG | EDIT_DIALOG;

export const ManageSpace: React.FC<Props> = ({ space, refetch }) => {
  const joinedMap = useMySpaces();
  const me = useMe();
  const [state, setState] = useState<ManageState>(NONE);

  const joined = joinedMap.get(space.id, null);
  if (me === null || joined === null || !joined.member.isAdmin) {
    return null;
  }
  const items: IContextualMenuItem[] = [
    {
      key: 'createChannel',
      text: '创建频道',
      iconProps: {
        iconName: 'create',
      },
      onClick: () => setState(CREATE_CHANNEL_DIALOG),
    },
    {
      key: 'editSpace',
      text: '编辑位面',
      iconProps: {
        iconName: 'edit',
      },
      onClick: () => setState(EDIT_DIALOG),
    },
  ];
  return (
    <>
      <EditSpaceDialog space={space} isOpen={state === EDIT_DIALOG} close={() => setState(NONE)} refetch={refetch} />
      <CreateChannelDialog
        space={space}
        isOpen={state === CREATE_CHANNEL_DIALOG}
        close={() => setState(NONE)}
        refetch={refetch}
      />
      <DefaultButton
        text="管理位面"
        menuProps={{
          shouldFocusOnMount: true,
          items,
        }}
      />
    </>
  );
};
