import { AppState, Joined } from './states';
import { Action, Information, JoinChannel, LeaveSpace, LoadJoined, Login, Logout } from './actions';
import { INFORMATION, JOIN_CHANNEL, JOIN_SPACE, LEAVE_SPACE, LOAD_JOINED, LOGIN, LOGOUT } from '../consts';
import { clearMe, setMe } from '../api/users';
import { clearCsrfToken } from '../api/client';
import { Map } from 'immutable';
import { JoinedSpace } from '../api/spaces';

const handleLoadJoined = (state: AppState, { joinedMap }: LoadJoined): AppState => {
  return { ...state, joinedMap };
};

const handleJoinSpace = (state: AppState, action: JoinedSpace): AppState => {
  const joinedMap = state.joinedMap.set(action.space.id, {
    space: action,
    channels: Map(),
  });
  return { ...state, joinedMap };
};

const handleLeaveSpace = (state: AppState, action: LeaveSpace): AppState => {
  const joinedMap = state.joinedMap.remove(action.spaceId);
  return { ...state, joinedMap };
};

const handleLogout = (state: AppState, _: Logout): AppState => {
  clearMe();
  clearCsrfToken();
  return { ...state, joinedMap: Map(), me: null };
};

const handleLogin = (state: AppState, { user }: Login): AppState => {
  clearMe();
  clearCsrfToken();
  setMe(user);
  return { ...state, me: user };
};

const handleInformation = (state: AppState, action: Information): AppState => {
  const informationList = state.informationList.push(action);
  return { ...state, informationList };
};

const handleJoinChannel = (state: AppState, action: JoinChannel): AppState => {
  const { spaceId } = action.joined.channel;
  let joinedMap = state.joinedMap;
  const joined: Joined | null = state.joinedMap.get(spaceId, null);
  if (joined !== null) {
    const channels = joined.channels.set(action.joined.channel.id, action.joined);
    joinedMap = joinedMap.set(spaceId, { ...joined, channels });
  }

  return { ...state, joinedMap };
};

export const appReducer = (state: AppState, action: Action): AppState => {
  console.log(action);
  switch (action.tag) {
    case LOGIN:
      return handleLogin(state, action);
    case LOGOUT:
      return handleLogout(state, action);
    case JOIN_SPACE:
      return handleJoinSpace(state, action);
    case LOAD_JOINED:
      return handleLoadJoined(state, action);
    case LEAVE_SPACE:
      return handleLeaveSpace(state, action);
    case INFORMATION:
      return handleInformation(state, action);
    case JOIN_CHANNEL:
      return handleJoinChannel(state, action);
    default:
      console.log(action);
      return state;
  }
};
