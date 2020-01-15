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
  return post<LoginResult>('/users/login', { username, password });
};

export const queryUser = (id: string): Promise<AppResult<User>> => {
  return get('/users/query', { id });
};

export const register = (email: string, username: string, password: string, nickname: string) => {
  return post<User>('/users/register', { email, username, password, nickname });
};

export const edit = (nickname: string, bio: string, avatar: string) => {
  return post<User>('/users/edit', { nickname, bio, avatar });
};
