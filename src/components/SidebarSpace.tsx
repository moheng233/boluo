import React from 'react';
import { JoinedSpace } from '../state/states';
import { Link } from 'react-router-dom';
import { SidebarChannelItem } from './SidebarChannelItem';
import './SidebarSpace.scss';

interface Props {
  mySpace: JoinedSpace;
}

export const SidebarSpace: React.FC<Props> = ({ mySpace }) => {
  const { space, channels } = mySpace;
  const channelItems = channels
    .toList()
    .map(({ channel }) => <SidebarChannelItem key={channel.id} channel={channel} />);
  return (
    <div className="SidebarSpace">
      <div className="space-item">
        <Link to={`/space/${space.id}`}>{space.name}</Link>
      </div>
      <div className="channel-list">{channelItems}</div>
    </div>
  );
};
