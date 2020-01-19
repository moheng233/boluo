import React from 'react';
import { Action } from './state/actions';

export type InputChangeHandler = React.ChangeEventHandler<HTMLInputElement>;
export type ButtonHandler = React.MouseEventHandler<HTMLButtonElement>;
export type Dispatcher = (action: Action) => void;
