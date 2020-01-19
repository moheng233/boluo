import React from 'react';

const enum IconKind {
  Mask = 'theater-masks',
  Action = 'running',
  Comment = 'comments',
  Preview = 'satellite-dish',
}

interface Props {
  name: IconKind;
}

// https://fontawesome.com/icons?d=gallery&m=free
export const Icon: React.FC<Props> = ({ name }) => {
  return <i className={`fas fa-${name}`} />;
};
