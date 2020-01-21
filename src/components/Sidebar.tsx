import React, { useEffect } from 'react';
import { User } from '../api/users';
import { Link, Switch, Route, useHistory } from 'react-router-dom';
import { useMySpaces, useMe, useDispatch } from './App';
import { fetchJoined } from '../api/spaces';
import './Sidebar.scss';
import { SidebarSpace } from './SidebarSpace';
import { CommandBarButton, IContextualMenuProps } from 'office-ui-fabric-react';

const LoggedIn: React.FC<{ me: User }> = ({ me }) => {
  const history = useHistory();
  const mySpaces = useMySpaces();

  const spaceList = mySpaces.toList().map(mySpace => <SidebarSpace key={mySpace.space.id} mySpace={mySpace} />);

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'logout',
        text: '登出',
        iconProps: { iconName: 'logout' },
        onClick: () => history.push('/logout'),
      },
      {
        key: 'home',
        text: '首页',
        iconProps: { iconName: 'home' },
        onClick: () => history.push('/'),
      },
    ],
  };
  return (
    <div className="Sidebar logged-in">
      <div className="sidebar-header">
        <CommandBarButton
          className="sidebar-header-button"
          text={me.nickname}
          iconProps={{ iconName: 'bars' }}
          menuProps={menuProps}
        />
      </div>
      <div className="joined-list">{spaceList}</div>
    </div>
  );
};

const NotLoggedIn: React.FC = () => {
  return (
    <div className="Sidebar">
      <Link className="logo" to="/">
        菠萝
      </Link>
      <nav className="user-nav not-logged-in">
        <Link to="/login">登录</Link>
        <Link to="/register">注册</Link>
      </nav>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const me = useMe();
  const dispatch = useDispatch();

  useEffect(() => {
    if (me) {
      fetchJoined(dispatch);
    }
  }, [me]);

  const sidebar = me === null ? <NotLoggedIn /> : <LoggedIn me={me} />;
  return (
    <Switch>
      <Route path="/login" />
      <Route path="/register" />
      <Route path="/">{sidebar}</Route>
    </Switch>
  );
};
