import { getMe, User } from '../api/users';
import { JoinedSpaceData } from '../api/spaces';
import { List, Map } from 'immutable';
import { JoinedChannelData } from '../api/channels';
import { Information } from './actions';

export interface JoinedSpace extends JoinedSpaceData {
  channels: Map<string, JoinedChannelData>;
}

export interface AppState {
  me: User | null;
  mySpaces: Map<string, JoinedSpace>;
  informationList: List<Information>;
  cache: Map<string, unknown>;
}

export const initAppState = (): AppState => ({
  me: getMe(),
  mySpaces: Map(),
  informationList: List(),
  cache: Map(),
});
