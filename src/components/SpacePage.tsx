import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRender } from '../helper/fetch';
import { querySpaceWithRelated } from '../api/spaces';
import { Channel } from '../api/channels';
import { JoinOrLeaveSpaceButton } from './JoinOrLeaveSpaceButton';
import { useMe } from './App';
import { ManageSpace } from './ManageSpace';
import './SpacePage.scss';

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
  return useRender(
    {
      className: 'SpacePage',
      fetch: () => querySpaceWithRelated(id),
      render: ({ space, channels }, refetch) => {
        const channelList = channels.map(channel => <ChannelItem key={channel.id} channel={channel} />);
        return (
          <>
            <div className="main-header space-header">
              <div className="space-id">{space.name}</div>
              {me === null ? null : <JoinOrLeaveSpaceButton space={space} />}
            </div>
            <div className="space-info">
              <p className="description">{space.description}</p>
              <ManageSpace space={space} refetch={refetch} />
            </div>
            <ul className="space-channels">{channelList}</ul>
          </>
        );
      },
    },
    [id]
  );
};
