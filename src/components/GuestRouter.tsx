import BasePage from '../components/templates/BasePage';
import { Link, Route, Routes } from 'react-router-dom';
import Login from '../components/pages/Login';
import SignUp from '../components/pages/SignUp';
import Profile from '../components/pages/Profile';
import ExploreSpace from '../components/pages/ExploreSpace';
import SpacePage from '../components/pages/SpacePage';
import GuestHome from '../components/pages/GuestHome';
import NotFound from '../components/pages/NotFound';
import React from 'react';

export function GuestRouter() {
  return (
    <BasePage>
      <Routes>
        <Route path="login" element={<Login></Login>}>
        </Route>
        <Route path="sign-up" element={<SignUp />}>
          
        </Route>
        <Route path="profile/:id" element={<Profile />}>
          
        </Route>
        <Route path="space/explore" element={<ExploreSpace />}>
          
        </Route>
        <Route path="space/:id" element={<SpacePage />}>
          
        </Route>
        <Route path="join/space/:id/:token" element={<Link to="/login" />}>
          
        </Route>
        <Route path="/" element={<GuestHome />}>
          
        </Route>
        <Route path="/" element={<NotFound />}>
          
        </Route>
      </Routes>
    </BasePage>
  );
}

export default GuestRouter;
