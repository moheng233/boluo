import { Space } from './spaces';
import { AppResult, get } from './client';

export interface CreateChannel {
  spaceId: string;
  name: string;
}

export interface Channel {
  id: string;
  name: string;
  topic: string;
  spaceId: string;
  created: string;
  isPublic: boolean;
}

export interface ChannelMember {
  userId: string;
  channelId: string;
  joinDate: string;
  characterName: string;
  isMaster: boolean;
  textColor: string;
}

export interface JoinedChannelData {
  channel: Channel;
  member: ChannelMember;
}

export interface JoinChannel {
  channelId: string;
  characterName?: string;
}

export interface ChannelWithRelated {
  channel: Channel;
  members: ChannelMember[];
  space: Space;
}

export interface EditChannel {
  channelId: string;
  name: string;
}

export const joinedChannels = (): Promise<AppResult<JoinedChannelData[]>> => get<JoinedChannelData[]>('/channels/my');
