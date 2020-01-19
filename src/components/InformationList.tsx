import React from 'react';
import { Information } from '../state/actions';
import { List } from 'immutable';

interface Props {
  informationList: List<Information>;
}

export const InformationItem: React.FC<{ information: Information }> = ({ information }) => {
  const level = information.level.toLowerCase();
  return <div className={`InformationItem ${level}`}>{information.message}</div>;
};

export const InformationList: React.FC<Props> = ({ informationList }) => {
  const list = informationList.map((information, index) => <InformationItem key={index} information={information} />);
  return <div className="some-information">{list}</div>;
};
