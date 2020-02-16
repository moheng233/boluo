import { Entity } from '../entities';

export interface Message {
  id: string;
  senderId: string;
  parentMessageId: string | null;
  name: string;
  mediaId: string | null;
  seed: number[];
  deleted: boolean;
  inGame: boolean;
  isAction: boolean;
  isMaster: boolean;
  pinned: boolean;
  tags: string[];
  folded: boolean;
  text: string;
  whisperToUsers: string[] | null;
  entities: Entity[];
  created: number;
  modified: number;
  orderDate: number;
  orderOffset: number;
}

export interface Preview {
  id: string;
  senderId: string;
  channelId: string;
  parentMessageId: string | null;
  name: string;
  mediaId: string | null;
  inGame: boolean;
  isAction: boolean;
  isMaster: boolean;
  text: string;
  whisperToUsers: string[] | null;
  entities: Entity[];
  start: number;
}

export interface NewPreview {
  id: string;
  channelId: string;
  parentMessageId: string | null;
  name: string;
  mediaId: string | null;
  inGame: boolean;
  isAction: boolean;
  text: string;
  whisperToUsers: string[] | null;
  entities: Entity[];
  start: number;
}

export interface NewMessage {
  messageId: string;
  channelId: string;
  name: string;
  text: string;
  entities: unknown[];
  inGame: boolean;
  isAction: boolean;
}

export interface Edit {
  messageId: string;
  name?: string;
  text?: string;
  entities?: object;
  inGame?: boolean;
  isAction?: boolean;
}
