import React from 'react';
import { User } from '../api/users';
import { Link, Switch, Route } from 'react-router-dom';
import { useJoinedMap, useMe } from './App';

const LoggedIn: React.FC<{ me: User }> = ({ me }) => {
  const joinedMap = useJoinedMap();
  const joined = joinedMap.toList().map((joined, key) => {
    const joinedChannels = joined.channels.toList().map(({ channel }, key) => <li key={key}>{channel.name}</li>);
    return (
      <li key={key}>
        {joined.space.space.name}
        <ul>{joinedChannels}</ul>
      </li>
    );
  });
  return (
    <div className="Sidebar logged-in">
      <div className="user">
        <span className="nickname">{me.nickname}</span>
        <Link to="/logout">登出</Link>
      </div>
      <ul className="joined">{joined}</ul>
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
  const sidebar = me === null ? <NotLoggedIn /> : <LoggedIn me={me} />;
  return (
    <Switch>
      <Route path="/login" />
      <Route path="/register" />
      <Route path="/">{sidebar}</Route>
    </Switch>
  );
};
