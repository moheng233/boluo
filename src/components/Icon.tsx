import React from 'react';
import { registerIcons } from '@uifabric/styling';

export const enum IconKind {
  Mask = 'theater-masks',
  Action = 'running',
  Comment = 'comments',
  Preview = 'satellite-dish',
  Error = 'exclamation-triangle',
}

interface Props {
  name: string;
}

// https://fontawesome.com/icons?d=gallery&m=free
export const Icon: React.FC<Props> = ({ name }) => {
  return <i className={`fas fa-${name}`} />;
};

export const register = () => {
  registerIcons({
    icons: {
      errorbadge: <Icon name={'exclamation-triangle'} />,
      cancel: <Icon name={'times-circle'} />,
      clear: <Icon name={'times-circle'} />,
      join: <Icon name={'user-plus'} />,
      leave: <Icon name={'user-minus'} />,
      create: <Icon name={'plus-square'} />,
      chevrondown: <Icon name={'chevron-down'} />,
      edit: <Icon name={'edit'} />,
      mask: <Icon name={'theater-masks'} />,
      broadcast: <Icon name={'broadcast-tower'} />,
      action: <Icon name={'running'} />,
      send: <Icon name={'paper-plane'} />,
      info: <Icon name={'info-circle'} />,
      history: <Icon name={'history'} />,
      more: <Icon name={'ellipsis-h'} />,
      logout: <Icon name={'sign-out-alt'} />,
      home: <Icon name={'home'} />,
      bars: <Icon name={'bars'} />,
    },
  });
};
