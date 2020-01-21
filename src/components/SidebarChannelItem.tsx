import React from 'react';
import { Channel } from '../api/channels';
import { Link } from 'react-router-dom';

interface Props {
  channel: Channel;
}

export const SidebarChannelItem: React.FC<Props> = ({ channel }) => {
  return (
    <div className="SidebarChannelItem">
      <Link to={`/channel/${channel.id}`}>{channel.name}</Link>
    </div>
  );
};
