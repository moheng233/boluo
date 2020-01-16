import React from 'react';
import '../styles.scss';
import { Sidebar } from './Sidebar';
import { Switch, Route } from 'react-router-dom';
import { HomePage } from './HomePage';
import { Register } from './Register';
import { Login } from './Login';
import { Logout } from './Logout';

export const App = () => {
  return (
    <div id="App">
      <Sidebar />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
      </Switch>
    </div>
  );
};
