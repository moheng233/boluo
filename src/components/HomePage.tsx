import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getMe } from '../api/users';
import { getSpaceList, Space } from '../api/spaces';
import { useRender } from '../helper/fetch';
import { PrimaryButton } from 'office-ui-fabric-react';
import { CreateSpaceDialog } from './CreateSpaceDialog';

const Intro: React.FC = () => {
  return (
    <div className="Intro">
      <div className="introduction">
        <h1 className="title">菠萝</h1>
        <p className="slogan subtitle">可口的跑团工具</p>
        <p>
          <Link className="register" to="/register">
            立即加入
          </Link>
        </p>
        <p>
          已经菠萝菠萝哒了？
          <Link className="login" to="/login">
            点这里登录
          </Link>
          。
        </p>
      </div>
      <div className="features">
        <h2>为什么用菠萝？</h2>
        <ul>
          <li>为跑团（桌上RPG）特别打造。</li>
          <li>实时预览，让文字输入像当面说话一样。</li>
          <li>开放的源代码和 API。</li>
          <li>即将到来的变量系统、回合指示器、战斗地图…</li>
        </ul>
      </div>
    </div>
  );
};

const SpaceItem: React.FC<{ space: Space }> = ({ space }) => {
  return (
    <li className="SpaceItem">
      <h3>
        <Link to={'/space/' + space.id}>{space.name}</Link>
      </h3>
      <p>{space.description}</p>
    </li>
  );
};

const Spaces: React.FC = () => {
  return useRender(
    {
      className: 'Spaces',
      fetch: getSpaceList,
      render: spaces => {
        const spaceList = spaces.map(space => <SpaceItem key={space.id} space={space} />);
        return <ul className="Spaces">{spaceList}</ul>;
      },
    },
    []
  );
};

export const HomePage: React.FC = () => {
  const me = getMe();
  const [showCreateSpaceDialog, setShowCreateSpaceDialog] = useState(false);
  const openCreateSpaceDialog = () => setShowCreateSpaceDialog(true);
  const dismissCreateSpaceDialog = () => setShowCreateSpaceDialog(false);

  return (
    <div className="HomePage">
      <CreateSpaceDialog show={showCreateSpaceDialog} dismiss={dismissCreateSpaceDialog} />
      {me === null ? <Intro /> : null}
      <div className="spaces">
        <h2>可达的位面</h2>
        {me === null ? null : (
          <PrimaryButton iconProps={{ iconName: 'create' }} onClick={openCreateSpaceDialog}>
            创造自己的位面
          </PrimaryButton>
        )}
        <Spaces />
      </div>
    </div>
  );
};
