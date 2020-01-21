import React from 'react';
import { get } from '../api/client';
import { Message } from '../api/messages';
import { useRender } from '../helper/fetch';
import { MessageItem } from './MessageItem';

interface Props {
  channelId: string;
}

export const MessageList: React.FC<Props> = ({ channelId }) => {
  return useRender(
    {
      className: 'MessageList',
      fetch: () => get<Message[]>('/messages/by_channel', { id: channelId }),
      render: (messages, refetch) => {
        return (
          <div className="MessageList">
            {messages.map(message => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        );
      },
    },
    [channelId]
  );
};
