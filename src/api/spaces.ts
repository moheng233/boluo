import { AppResult, get, post } from './client';
import { Dispatcher } from '../types';
import { Channel, JoinedChannel, joinedChannels } from './channels';
import { Joined } from '../state/states';
import { Map } from 'immutable';
import { loadJoined } from '../state/actions';

export interface Space {
  id: string;
  name: string;
  description: string;
  created: string;
  modified: string;
  ownerId: string;
  isPublic: boolean;
  language: string;
  defaultDiceType: string;
}

export interface SpaceMember {
  userId: string;
  spaceId: string;
  isAdmin: string;
  joinDate: string;
}

export interface JoinedSpace {
  space: Space;
  member: SpaceMember;
}

export interface CreateSpace {
  name: string;
  password: string | null;
}

export interface EditSpace {
  spaceId: string;
  name: string;
}

export interface SpaceWithRelated {
  space: Space;
  members: SpaceMember[];
  channels: Channel[];
}

export const getSpaceList = (): Promise<AppResult<Space[]>> => get('/spaces/list');

export const querySpace = (id: string): Promise<AppResult<Space>> => get('/spaces/query', { id });

export const querySpaceWithRelated = (id: string): Promise<AppResult<SpaceWithRelated>> =>
  get('/spaces/query_with_related', { id });

export const joinSpace = (id: string): Promise<AppResult<SpaceMember>> => post('/spaces/join', {}, { id });

export const joinedSpaces = (): Promise<AppResult<JoinedSpace[]>> => get<JoinedSpace[]>('/spaces/my');

export const leaveSpace = (id: string): Promise<AppResult<true>> => post<true>('/spaces/leave', {}, { id });

export const fetchJoined = async (dispatch: Dispatcher) => {
  const spaceResult = await joinedSpaces();
  const channelResult = await joinedChannels();
  if (spaceResult.ok && channelResult.ok) {
    const joinedSpaces = spaceResult.some;
    const joinedChannels = channelResult.some;
    let joinedMap: Map<string, Joined> = Map();
    for (const joinedSpace of joinedSpaces) {
      let joinedChannelMap: Map<string, JoinedChannel> = Map();
      for (const joinedChannel of joinedChannels) {
        if (joinedChannel.channel.spaceId === joinedSpace.space.id) {
          joinedChannelMap = joinedChannelMap.set(joinedChannel.channel.id, joinedChannel);
        }
      }
      joinedMap = joinedMap.set(joinedSpace.space.id, {
        space: joinedSpace,
        channels: joinedChannelMap,
      });
    }
    dispatch(loadJoined(joinedMap));
  }
};
