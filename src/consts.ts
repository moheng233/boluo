export type LOADING = typeof LOADING;
export const LOADING = 'LOADING';

export const ERROR = 'ERROR';
export type ERROR = typeof ERROR;

export const LOGIN = 'LOGIN';
export type LOGIN = typeof LOGIN;

export const LOGOUT = 'LOGOUT';
export type LOGOUT = typeof LOGOUT;

export const JOIN_SPACE = 'JOIN_SPACE';
export type JOIN_SPACE = typeof JOIN_SPACE;

export const EDIT_SPACE = 'EDIT_SPACE';
export type EDIT_SPACE = typeof EDIT_SPACE;

export const JOIN_CHANNEL = 'JOIN_CHANNEL';
export type JOIN_CHANNEL = typeof JOIN_CHANNEL;

export const LEAVE_SPACE = 'LEAVE_SPACE';
export type LEAVE_SPACE = typeof LEAVE_SPACE;

export const LOAD_JOINED = 'LOAD_JOINED';
export type LOAD_JOINED = typeof LOAD_JOINED;

export const LEAVE_CHANNEL = 'LEAVE_CHANNEL';
export type LEAVE_CHANNEL = typeof LEAVE_CHANNEL;

export const INFORMATION = 'INFORMATION';
export type INFORMATION = typeof INFORMATION;

export const INFO = 'INFO';
export type INFO = typeof INFO;

export const SUCCESS = 'SUCCESS';
export type SUCCESS = typeof SUCCESS;

export const LOAD_CACHE = 'LOAD_CACHE';
export type LOAD_CACHE = typeof LOAD_CACHE;

// Error Code
export type ErrorCode =
  | UNAUTHENTICATED
  | NO_PERMISSION
  | NOT_JSON
  | NOT_FOUND
  | UNEXPECTED
  | BAD_REQUEST
  | VALIDATION_FAIL
  | CONFLICT
  | FETCH_FAIL
  | LOAD_CACHE
  | METHOD_NOT_ALLOWED;

export const UNAUTHENTICATED = 'UNAUTHENTICATED';
export type UNAUTHENTICATED = typeof UNAUTHENTICATED;

export const NO_PERMISSION = 'NO_PERMISSION';
export type NO_PERMISSION = typeof NO_PERMISSION;

export const NOT_JSON = 'NOT_JSON';
export type NOT_JSON = typeof NOT_JSON;

export const NOT_FOUND = 'NOT_FOUND';
export type NOT_FOUND = typeof NOT_FOUND;

export const FETCH_FAIL = 'FETCH_FAIL';
export type FETCH_FAIL = typeof FETCH_FAIL;

export const UNEXPECTED = 'UNEXPECTED';
export type UNEXPECTED = typeof UNEXPECTED;

export const BAD_REQUEST = 'BAD_REQUEST';
export type BAD_REQUEST = typeof BAD_REQUEST;

export const VALIDATION_FAIL = 'VALIDATION_FAIL';
export type VALIDATION_FAIL = typeof VALIDATION_FAIL;

export const CONFLICT = 'CONFLICT';
export type CONFLICT = typeof CONFLICT;

export const METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED';
export type METHOD_NOT_ALLOWED = typeof METHOD_NOT_ALLOWED;

// Event
export const NEW_MESSAGE = 'newMessage';
export type NEW_MESSAGE = typeof NEW_MESSAGE;

export const MESSAGE_DELETED = 'messageDeleted';
export type MESSAGE_DELETED = typeof MESSAGE_DELETED;

export const MESSAGE_EDITED = 'messageEdited';
export type MESSAGE_EDITED = typeof MESSAGE_EDITED;

export const MESSAGE_PREVIEW = 'messagePreview';
export type MESSAGE_PREVIEW = typeof MESSAGE_PREVIEW;

export const CHANNEL_DELETED = 'channelDeleted';
export type CHANNEL_DELETED = typeof CHANNEL_DELETED;

export const CHANNEL_EDITED = 'channelEdited';
export type CHANNEL_EDITED = typeof CHANNEL_EDITED;
