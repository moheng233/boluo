import { getMe, User } from '../api/users';
import { JoinedSpace } from '../api/spaces';
import { List, Map } from 'immutable';
import { JoinedChannel } from '../api/channels';
import { Information } from './actions';

export interface Joined {
  space: JoinedSpace;
  channels: Map<string, JoinedChannel>;
}

export interface AppState {
  me: User | null;
  joinedMap: Map<string, Joined>;
  informationList: List<Information>;
}

export const initAppState = (): AppState => ({
  me: getMe(),
  joinedMap: Map(),
  informationList: List(),
});
