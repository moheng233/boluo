import { useDispatch } from '../store';
import {  useNavigate } from 'react-router-dom';
import { get } from '../api/request';
import { LoggedOut } from '../actions/profile';

export function useLogout(): () => void {
  const dispatch = useDispatch();
  const history =  useNavigate();
  return async () => {
    await get('/users/logout');
    dispatch<LoggedOut>({ type: 'LOGGED_OUT' });
    history('/');
  };
}
