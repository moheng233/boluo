import React from 'react';
import { Message } from '../api/messages';
import './MessageItem.scss';
import { nameToHSL } from '../utils';

interface Props {
  message: Message;
}

export const MessageItem: React.FC<Props> = ({ message }) => {
  const classes = ['MessageItem'];
  if (message.isAction) {
    classes.push('action-message');
  }
  if (message.isMaster) {
    classes.push('master-message');
  }
  if (!message.inGame) {
    classes.push('ooc-message');
  }
  let style: React.CSSProperties | undefined;
  if (message.inGame) {
    style = {
      color: nameToHSL(message.name),
    };
  }
  return (
    <div className={classes.join(' ')} style={style}>
      <div className="name">{message.name}</div>
      <div className="text">{message.text}</div>
    </div>
  );
};
