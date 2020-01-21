import React, { useState } from 'react';
import { Information } from '../state/actions';
import { List } from 'immutable';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { ERROR } from '../consts';

interface Props {
  informationList: List<Information>;
}

export const InformationItem: React.FC<{ information: Information }> = ({ information }) => {
  const level = information.level;
  const [hide, setHide] = useState(false);
  let type: MessageBarType = MessageBarType.info;
  if (level === ERROR) {
    type = MessageBarType.error;
  }
  if (hide) {
    return null;
  }
  return (
    <MessageBar onDismiss={() => setHide(true)} messageBarType={type} dismissButtonAriaLabel="关闭">
      {information.message}
    </MessageBar>
  );
};

export const InformationList: React.FC<Props> = ({ informationList }) => {
  const list = informationList.map((information, index) => <InformationItem key={index} information={information} />);
  return <div className="InformationList">{list}</div>;
};
