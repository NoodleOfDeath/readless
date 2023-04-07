import { UserData, UserDataProps } from './UserData';

import {
  LoginResponse,
  ReadingFormat,
  RequestParams,
} from '~/api';

export type ColorMode = 'light' | 'dark';

export type Preferences = {
  displayMode?: ColorMode;
  lastReleaseNotesDate?: string;
  preferredReadingFormat?: ReadingFormat;
  bookmarks?: { [key: string]: boolean };
};

// Headers

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

// Context

export type SessionSetOptions = {
  updateCookie?: boolean;
};

export type SessionContextType = {
  ready?: boolean;
  // user data
  userData?: UserData;
  setUserData: (state?: UserDataProps | ((state?: UserDataProps) => UserDataProps | undefined), options?: SessionSetOptions) => void;
  addUserToken: (token: LoginResponse['token']) => void;
  // preferences
  preferences: Preferences;
  setPreference(key: keyof Preferences, value: Preferences[keyof Preferences]): void;
  // header hooks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const DEFAULT_SESSION_CONTEXT: SessionContextType = {
  addUserToken: () => {
    /* placeholder function */
  },
  preferences: {},
  setPreference: () => {
    /* placeholder function */
  },
  setUserData: () => {
    /* placeholder function */
  },
  withHeaders: (fn) => (...args) => fn(...args, {}),
};