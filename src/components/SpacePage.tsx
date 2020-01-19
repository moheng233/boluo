import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { renderFetchResult, useFetch } from '../helper/fetch';
import { querySpaceWithRelated } from '../api/spaces';
import { Channel } from '../api/channels';
import { JoinOrLeaveSpaceButton } from './JoinOrLeaveSpaceButton';
import { CreateChannelButton } from './CreateChannelButton';
import { useMe } from './App';

interface Props {}

interface Params {
  id: string;
}

const ChannelItem: React.FC<{ channel: Channel }> = ({ channel }) => {
  return (
    <li className="ChannelItem">
      <Link to={`/channel/${channel.id}`}>{channel.name}</Link>
    </li>
  );
};

export const SpacePage: React.FC<Props> = () => {
  const { id } = useParams<Params>();
  const me = useMe();
  const [result, refetch] = useFetch(async () => querySpaceWithRelated(id));

  return renderFetchResult(result, ({ space, channels }) => {
    const channelList = channels.map(channel => <ChannelItem key={channel.id} channel={channel} />);
    return (
      <div className="SpacePage">
        <div className="space-info">
          <h1 className="space-id">{space.name}</h1>
          <p className="description">{space.description}</p>
          {me === null ? null : <CreateChannelButton spaceId={space.id} refetch={refetch} />}
          {me === null ? null : <JoinOrLeaveSpaceButton space={space} />}
        </div>
        <ul className="space-channels">{channelList}</ul>
      </div>
    );
  });
};
