import React from 'react';
import { useParams } from 'react-router-dom';
import { useRender } from '../helper/fetch';
import { get } from '../api/client';
import { ChannelWithRelated } from '../api/channels';
import { JoinOrLeaveChannelButton } from './JoinOrLeaveChannelButton';
import { MessageInputArea } from './MessageInputArea';
import { useMySpaces } from './App';
import { MessageList } from './MessageList';
import './ChannelPage.scss';

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
      render: ({ channel, space }) => {
        const joinedSpace = mySpaces.get(space.id);
        const member = joinedSpace?.channels.get(channel.id)?.member;

        return (
          <>
            <div className="channel-header main-header">
              <div className="channel-name">{channel.name}</div>
              <div className="channel-operators">
                <JoinOrLeaveChannelButton channel={channel} />
              </div>
            </div>
            <MessageList channelId={channel.id} />
            <div className="input-area">{member ? <MessageInputArea channel={channel} member={member} /> : null}</div>
          </>
        );
      },
    },
    [id]
  );
};
