import { AppResult, get, post } from './client';

export interface User {
  id: string;
  username: string;
  nickname: string;
  bio: string;
  joined: string;
  deactivated: boolean;
  avatar_id: string | null;
}

export interface LoginResult {
  user: User;
  token: null;
}

export const login = (username: string, password: string): Promise<AppResult<LoginResult>> => {
  return post<LoginResult>('/users/login', { username, password }, {}, false);
};

export const queryUser = (id: string): Promise<AppResult<User>> => {
  return get('/users/query', { id });
};

export const register = (email: string, username: string, password: string, nickname: string) => {
  return post<User>('/users/register', { email, username, password, nickname }, {}, false);
};

export const edit = (nickname: string, bio: string, avatar: string) => {
  return post<User>('/users/edit', { nickname, bio, avatar });
};

const ME_KEY = 'me';

export const getMe = (): User | null => {
  const meData = localStorage.getItem(ME_KEY);
  if (meData === null) {
    return null;
  }
  try {
    return JSON.parse(meData);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const setMe = (me: User) => {
  localStorage.setItem(ME_KEY, JSON.stringify(me));
};

export const clearMe = () => {
  localStorage.removeItem(ME_KEY);
};
