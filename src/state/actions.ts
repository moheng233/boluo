import {
  EDIT_SPACE,
  ERROR,
  INFO,
  INFORMATION,
  JOIN_CHANNEL,
  JOIN_SPACE,
  LEAVE_CHANNEL,
  LEAVE_SPACE,
  LOAD_CACHE,
  LOAD_JOINED,
  LOGIN,
  LOGOUT,
  SUCCESS,
} from '../consts';
import { User } from '../api/users';
import { Space, SpaceMember } from '../api/spaces';
import { JoinedSpace } from './states';
import { Map } from 'immutable';
import { JoinedChannelData } from '../api/channels';

export type Action =
  | Login
  | Logout
  | JoinSpace
  | LoadJoined
  | LeaveSpace
  | Information
  | JoinChannel
  | LeaveChannel
  | LoadCache
  | EditSpace;

export interface Login {
  tag: LOGIN;
  user: User;
}

export const login = (user: User): Login => ({ tag: LOGIN, user });

export interface Logout {
  tag: LOGOUT;
}

export const logout = (): Logout => ({ tag: LOGOUT });

export interface JoinSpace {
  tag: JOIN_SPACE;
  space: Space;
  member: SpaceMember;
}

export const joinSpace = (space: Space, member: SpaceMember): JoinSpace => ({ tag: JOIN_SPACE, space, member });

export interface EditSpace {
  tag: EDIT_SPACE;
  space: Space;
}

export interface LoadJoined {
  tag: LOAD_JOINED;
  joinedMap: Map<string, JoinedSpace>;
}

export const loadJoined = (joinedMap: Map<string, JoinedSpace>): LoadJoined => ({ tag: LOAD_JOINED, joinedMap });

export interface LeaveSpace {
  tag: LEAVE_SPACE;
  spaceId: string;
}

export interface LeaveChannel {
  tag: LEAVE_CHANNEL;
  spaceId: string;
  channelId: string;
}

export interface Information {
  tag: INFORMATION;
  level: ERROR | SUCCESS | INFO;
  message: string;
}

export const errorInfo = (message: string): Information => ({ tag: INFORMATION, level: ERROR, message });

export const successInfo = (message: string): Information => ({ tag: INFORMATION, level: SUCCESS, message });

export const info = (message: string): Information => ({ tag: INFORMATION, level: INFO, message });

export interface JoinChannel {
  tag: JOIN_CHANNEL;
  joined: JoinedChannelData;
}

export interface LoadCache {
  tag: LOAD_CACHE;
  id: string;
  value: unknown;
}
