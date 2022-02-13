import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import Design from "./pages/Design";
import Chat from "./pages/Chat";
import LoggedInRouter from "./LoggedInRouter";
import GuestRouter from "./GuestRouter";

interface Props { }

export const Router: React.FC<Props> = () => {
  const isLoggedIn = useIsLoggedIn();

  return (
    <Routes>
      <Route path="/design" element={<Design />}></Route>
      <Route path="/chat/:spaceId/:channelId" element={<Chat />}></Route>
      <Route path="/chat/:spaceId" element={<Chat />}></Route>
      <Route path="/" element={isLoggedIn ? <LoggedInRouter /> : <GuestRouter />}></Route>
    </Routes>
  );
};
