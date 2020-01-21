import { Message, Preview } from './messages';
import {
  CHANNEL_DELETED,
  CHANNEL_EDITED,
  MESSAGE_DELETED,
  MESSAGE_EDITED,
  MESSAGE_PREVIEW,
  NEW_MESSAGE,
} from '../consts';

export interface EventQuery {
  mailbox: string;
  since: number;
}

export interface Event {
  eventId: string;
  mailbox: string;
  timestamp: number;
  body: EventBody;
}

export type EventBody = NewMessage | MessageDeleted | MessageEdited | MessagePreview;

export interface NewMessage {
  type: NEW_MESSAGE;
  message: Message;
}

export interface MessageDeleted {
  type: MESSAGE_DELETED;
  messageId: string;
}

export interface MessageEdited {
  type: MESSAGE_EDITED;
  message: Message;
}

export interface MessagePreview {
  type: MESSAGE_PREVIEW;
  preview: Preview;
}

export interface ChannelEdited {
  type: CHANNEL_EDITED;
}

export interface ChannelDeleted {
  type: CHANNEL_DELETED;
}
