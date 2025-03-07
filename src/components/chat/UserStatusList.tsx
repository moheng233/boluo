import * as React from 'react';
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from '../../store';
import { roundedSm, textSm, uiShadow } from '../../styles/atoms';
import MemberListItem from './MemberListItem';
import { blue, gray } from '../../styles/colors';
import { useChannelId } from '../../hooks/useChannelId';
import { css } from '@emotion/react';
import userPlusIcon from '../../assets/icons/user-plus.svg';
import Icon from '../atoms/Icon';
import { Id } from '../../utils/id';
import InviteChannelMemberDialog from './InviteChannelMemberDialog';
import { useUsersStatus } from '../../hooks/useUsersStatus';

const Container = styled.div`
  ${roundedSm};
  background-color: ${blue['900']};
  ${uiShadow};
  max-height: 60vh;
  overflow-y: auto;
`;

const invite = css`
  ${textSm};
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 100%;
  min-width: 14rem;
  &:hover {
    background-color: ${gray['800']};
  }
  &:active {
    background-color: ${gray['900']};
  }
`;

interface Props {
  spaceId: Id;
}

function MemberList({ spaceId }: Props) {
  return null;
  const myId = useSelector((state) => state.profile?.user.id);
  const members = useSelector((state) => {
    const spaceResult = state.ui.spaceSet.get(spaceId);
    if (spaceResult?.isOk) {
      const space = spaceResult.value;
      return space.members;
    } else {
      return [];
    }
  });
  const userStatus = useUsersStatus(spaceId);
  // const members = useSelector((state) => state.chatStates.get(pane)!.members);
  // const heartbeatMap = useSelector((state) => state.chatStates.get(pane)!.heartbeatMap);
  // const spaceOwnerId = useSelector((state) => {
  //   const spaceResult = state.ui.spaceSet.get(state.chatStates.get(pane)!.channel.spaceId);
  //   if (spaceResult === undefined || spaceResult.isErr) {
  //     return undefined;
  //   } else {
  //     return spaceResult.value.space.ownerId;
  //   }
  // });
  // const spaceMembers = useSelector((state) => {
  //   const spaceResult = state.ui.spaceSet.get(state.chatStates.get(pane)!.channel.spaceId);
  //   if (spaceResult === undefined || spaceResult.isErr) {
  //     return [];
  //   } else {
  //     return spaceResult.value.members;
  //   }
  // });
  // const [inviteDialog, showInviteDialog] = useState(false);
  // const myMember = myId ? members.find((member) => member.user.id === myId) : undefined;
  // const imAdmin = Boolean(myMember && myMember.space.isAdmin);
  // const inviteMembers = useMemo(() => {
  //   return spaceMembers
  //     .map(({ user }) => user)
  //     .filter((user) => {
  //       return members.findIndex((member) => member.user.id === user.id) === -1;
  //     });
  // }, [spaceMembers, members]);
  // return (
  //   <Container>
  //     {myMember && (
  //       <div css={invite} onClick={() => showInviteDialog(true)}>
  //         <Icon sprite={userPlusIcon} /> 添加新成员
  //       </div>
  //     )}
  //     {members.map(({ user, space, channel }) => (
  //       <MemberListItem
  //         key={user.id}
  //         timestamp={heartbeatMap.get(user.id)}
  //         user={user}
  //         spaceMember={space}
  //         channelMember={channel}
  //         imAdmin={imAdmin}
  //         spaceOwnerId={spaceOwnerId}
  //       />
  //     ))}
  //     {inviteDialog && (
  //       <InviteChannelMemberDialog
  //         channelId={channelId}
  //         members={inviteMembers}
  //         dismiss={() => showInviteDialog(false)}
  //       />
  //     )}
  //   </Container>
  // );
}

export default React.memo(MemberList);
