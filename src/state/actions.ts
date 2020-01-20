import {
  ERROR,
  INFO,
  INFORMATION,
  JOIN_CHANNEL,
  JOIN_SPACE,
  LEAVE_SPACE,
  LOAD_JOINED,
  LOGIN,
  LOGOUT,
  SUCCESS,
} from '../consts';
import { User } from '../api/users';
import { Space, SpaceMember } from '../api/spaces';
import { Joined } from './states';
import { Map } from 'immutable';
import { JoinedChannel } from '../api/channels';

export type Action = Login | Logout | JoinSpace | LoadJoined | LeaveSpace | Information | JoinChannel;

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

export interface LoadJoined {
  tag: LOAD_JOINED;
  joinedMap: Map<string, Joined>;
}

export const loadJoined = (joinedMap: Map<string, Joined>): LoadJoined => ({ tag: LOAD_JOINED, joinedMap });

export interface LeaveSpace {
  tag: LEAVE_SPACE;
  spaceId: string;
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
  joined: JoinedChannel;
}
