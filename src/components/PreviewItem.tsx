import React from 'react';
import { Preview } from '../api/messages';
import { nameToHSL } from '../utils';
import { MessageContent } from './MessageContent';

interface Props {
  preview: Preview;
}

export const PreviewItem: React.FC<Props> = ({ preview }) => {
  const classes = ['MessageItem'];
  if (preview.isAction) {
    classes.push('action-message');
  }
  if (preview.isMaster) {
    classes.push('master-message');
  }
  if (!preview.inGame) {
    classes.push('ooc-message');
  }
  let style: React.CSSProperties | undefined;
  if (preview.inGame) {
    style = {
      color: nameToHSL(preview.name),
    };
  }
  return (
    <div className={classes.join(' ')} style={style}>
      <div className="name">{preview.name}</div>
      <div className="text">
        <MessageContent text={preview.text} entities={preview.entities} />
      </div>
    </div>
  );
};
