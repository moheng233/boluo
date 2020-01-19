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
  entities: object;
  created: string;
  modified: string;
  orderDate: string;
  orderOffset: number;
}

export interface Preview {
  id: string;
  senderId: string;
  channelId: string;
  parentMessageId: string | null;
  name: string;
  mediaId: string;
  inGame: boolean;
  isAction: boolean;
  isMaster: boolean;
  text: string;
  whisperToUsers: string[] | null;
  entities: object;
  start: string;
}

export interface NewMessage {
  messageId?: string;
  channelId?: string;
  name?: string;
  text: string;
  entitles: object;
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
