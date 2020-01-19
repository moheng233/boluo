import React, { useContext, useEffect, useReducer } from 'react';
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
import { initAppState, Joined } from '../state/states';
import { Action } from '../state/actions';
import { User } from '../api/users';
import { fetchJoined } from '../api/spaces';
import { CreateSpacePage } from './CreateSpacePage';
import { Dispatcher } from '../types';
import { InformationList } from './InformationList';

const DispatchContext = React.createContext<(action: Action) => void>(() => {});

const MeContext = React.createContext<User | null>(null);

const JoinedMapContext = React.createContext<Map<string, Joined>>(Map());

export const useJoinedMap = (): Map<string, Joined> => useContext(JoinedMapContext);

export const useDispatch = (): (<T extends Action>(action: T) => void) => {
  return useContext(DispatchContext);
};

export const useMe = (): User | null => useContext(MeContext);

const useInit = (me: User | null, dispatch: Dispatcher) => {
  useEffect(() => {
    if (me) {
      fetchJoined(dispatch).catch(console.warn);
    }
  }, []);
};

export const App = () => {
  const [state, dispatch] = useReducer(appReducer, initAppState());
  useInit(state.me, dispatch);
  return (
    <BrowserRouter>
      <DispatchContext.Provider value={dispatch}>
        <MeContext.Provider value={state.me}>
          <JoinedMapContext.Provider value={state.joinedMap}>
            <div id="App">
              <InformationList informationList={state.informationList} />

              <Sidebar />

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

                <Route path="/space/create">
                  <CreateSpacePage />
                </Route>

                <Route path="/space/:id">
                  <SpacePage />
                </Route>

                <Route path="/">
                  <NotFound />
                </Route>
              </Switch>
            </div>
          </JoinedMapContext.Provider>
        </MeContext.Provider>
      </DispatchContext.Provider>
    </BrowserRouter>
  );
};
