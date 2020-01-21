import React, { useContext, useReducer } from 'react';
import { Sidebar } from './Sidebar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Map } from 'immutable';
import { HomePage } from './HomePage';
import { Register } from './Register';
import { Login } from './Login';
import { Logout } from './Logout';
import { NotFound } from './NotFound';
import { SpacePage } from './SpacePage';
import { appReducer } from '../state/reducer';
import { initAppState, JoinedSpace } from '../state/states';
import { Action } from '../state/actions';
import { User } from '../api/users';
import { InformationList } from './InformationList';
import { createTheme, Customizations } from 'office-ui-fabric-react';
import { register } from './Icon';
import { ChannelPage } from './ChannelPage';
import './App.scss';
import 'normalize.css/normalize.css';

register();

const theme = createTheme({
  defaultFontStyle: { fontFamily: 'Lato, sans-serif' },
});
Customizations.applySettings({ theme });

const DispatchContext = React.createContext<(action: Action) => void>(() => {});

const MeContext = React.createContext<User | null>(null);

const JoinedMapContext = React.createContext<Map<string, JoinedSpace>>(Map());

export const useMySpaces = (): Map<string, JoinedSpace> => useContext(JoinedMapContext);

export const useDispatch = (): (<T extends Action>(action: T) => void) => {
  return useContext(DispatchContext);
};

export const useMe = (): User | null => useContext(MeContext);

export const App = () => {
  const [state, dispatch] = useReducer(appReducer, initAppState());
  return (
    <BrowserRouter>
      <DispatchContext.Provider value={dispatch}>
        <MeContext.Provider value={state.me}>
          <JoinedMapContext.Provider value={state.mySpaces}>
            <div className="App">
              <InformationList informationList={state.informationList} />
              <Sidebar />
              <div className="main">
                <Switch>
                  <Route exact path="/">
                    <HomePage />
                  </Route>

                  <Route path="/register">
                    <Register />
                  </Route>

                  <Route path="/login/next/:next">
                    <Login />
                  </Route>

                  <Route exact path="/login">
                    <Login />
                  </Route>

                  <Route path="/logout">
                    <Logout />
                  </Route>

                  <Route path="/channel/:id">
                    <ChannelPage />
                  </Route>

                  <Route path="/space/:id">
                    <SpacePage />
                  </Route>

                  <Route path="/">
                    <NotFound />
                  </Route>
                </Switch>
              </div>
            </div>
          </JoinedMapContext.Provider>
        </MeContext.Provider>
      </DispatchContext.Provider>
    </BrowserRouter>
  );
};
