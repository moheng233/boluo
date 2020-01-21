import { AppState, JoinedSpace } from './states';
import {
  Action,
  EditSpace,
  Information,
  JoinChannel,
  LeaveChannel,
  LeaveSpace,
  LoadCache,
  LoadJoined,
  Login,
  Logout,
} from './actions';
import {
  EDIT_SPACE,
  INFORMATION,
  JOIN_CHANNEL,
  JOIN_SPACE,
  LEAVE_CHANNEL,
  LEAVE_SPACE,
  LOAD_CACHE,
  LOAD_JOINED,
  LOGIN,
  LOGOUT,
} from '../consts';
import { clearMe, setMe } from '../api/users';
import { clearCsrfToken } from '../api/client';
import { Map } from 'immutable';
import { JoinedSpaceData } from '../api/spaces';

const handleLoadJoined = (state: AppState, { joinedMap }: LoadJoined): AppState => {
  return { ...state, mySpaces: joinedMap };
};

const handleJoinSpace = (state: AppState, action: JoinedSpaceData): AppState => {
  const mySpaces = state.mySpaces.set(action.space.id, {
    ...action,
    channels: Map(),
  });
  return { ...state, mySpaces };
};

const handleLeaveSpace = (state: AppState, action: LeaveSpace): AppState => {
  const joinedMap = state.mySpaces.remove(action.spaceId);
  return { ...state, mySpaces: joinedMap };
};

const handleLogout = (state: AppState, _: Logout): AppState => {
  clearMe();
  clearCsrfToken();
  return { ...state, mySpaces: Map(), me: null };
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
  const joined: JoinedSpace | null = state.mySpaces.get(spaceId, null);
  if (joined === null) {
    return state;
  }
  const channels = joined.channels.set(action.joined.channel.id, action.joined);
  const mySpaces = state.mySpaces.set(spaceId, { ...joined, channels });
  return { ...state, mySpaces };
};

const handleLeaveChannel = (state: AppState, { spaceId, channelId }: LeaveChannel): AppState => {
  const oldJoinedSpace = state.mySpaces.get(spaceId, null);
  if (oldJoinedSpace === null) {
    return state;
  }
  const channels = oldJoinedSpace.channels.remove(channelId);
  const mySpaces = state.mySpaces.set(spaceId, { ...oldJoinedSpace, channels });
  return { ...state, mySpaces };
};

const handleEditSpace = (state: AppState, { space }: EditSpace): AppState => {
  const joinedSpace = state.mySpaces.get(space.id, null);
  if (joinedSpace === null) {
    return state;
  }
  const mySpaces = state.mySpaces.set(space.id, { ...joinedSpace, space });
  return { ...state, mySpaces };
};

const handleLoadCache = (state: AppState, { id, value }: LoadCache): AppState => {
  const cache = state.cache.set(id, value);
  return { ...state, cache };
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
    case EDIT_SPACE:
      return handleEditSpace(state, action);
    case LOAD_JOINED:
      return handleLoadJoined(state, action);
    case LEAVE_SPACE:
      return handleLeaveSpace(state, action);
    case INFORMATION:
      return handleInformation(state, action);
    case JOIN_CHANNEL:
      return handleJoinChannel(state, action);
    case LEAVE_CHANNEL:
      return handleLeaveChannel(state, action);
    case LOAD_CACHE:
      return handleLoadCache(state, action);
    default:
      console.log(action);
      return state;
  }
};
