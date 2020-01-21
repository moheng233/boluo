import React from 'react';
import { Message } from '../api/messages';

interface Props {
  message: Message;
}

export const MessageItem: React.FC<Props> = ({ message }) => {
  return (
    <div className="Message">
      <div>{message.name}</div>
      <div>{message.text}</div>
    </div>
  );
};
