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
    },
  });
};
