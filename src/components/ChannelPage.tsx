import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useRender } from '../helper/fetch';
import { get } from '../api/client';
import { ChannelWithRelated } from '../api/channels';
import { JoinOrLeaveChannelButton } from './JoinOrLeaveChannelButton';
import { MessageInputArea } from './MessageInputArea';
import { useMySpaces } from './App';
import { MessageList } from './MessageList';

interface Props {}

interface Params {
  id: string;
}

export const ChannelPage: React.FC<Props> = () => {
  const { id } = useParams<Params>();
  const mySpaces = useMySpaces();
  return useRender(
    {
      className: 'ChannelPage',
      fetch: () => get<ChannelWithRelated>('/channels/query_with_related', { id }),
      render: ({ channel, space, members }, refetch) => {
        const joinedSpace = mySpaces.get(space.id);
        const member = joinedSpace?.channels.get(channel.id)?.member;

        return (
          <div className="ChannelPage">
            <h1>
              {channel.name}
              <JoinOrLeaveChannelButton channel={channel} />
            </h1>
            <MessageList channelId={channel.id} />
            {member ? <MessageInputArea channel={channel} member={member} /> : null}
          </div>
        );
      },
    },
    [id]
  );
};
