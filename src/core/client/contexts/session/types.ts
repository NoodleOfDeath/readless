import { UserData, UserDataProps } from './UserData';

import {
  LoginResponse,
  ReadingFormat,
  RequestParams,
} from '~/api';

export type ColorMode = 'light' | 'dark';

export type Preferences = {
  displayMode?: ColorMode;
  preferredReadingFormat?: ReadingFormat;
};

// Headers

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

// Context

export type SessionSetOptions = {
  updateCookie?: boolean;
};

export type SessionContextType = {
  userData?: UserData;
  setUserData: (state?: UserDataProps | ((state?: UserDataProps) => UserDataProps | undefined), options?: SessionSetOptions) => void;
  addUserToken: (token: LoginResponse['token']) => void;
  // preferences
  preferences: Preferences;
  // getters
  displayMode?: ColorMode;
  setDisplayMode: React.Dispatch<React.SetStateAction<'light' | 'dark' | undefined>>;
  preferredReadingFormat?: ReadingFormat;
  setPreferredReadingFormat: React.Dispatch<
    React.SetStateAction<ReadingFormat | undefined>
  >;
  // session hooks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const NULL_SESSION: SessionContextType = {
  addUserToken: () => {
    /* placeholder function */
  },
  displayMode: 'light',
  preferences: {},
  preferredReadingFormat: ReadingFormat.Concise,
  setDisplayMode: () => {
    /* placeholder function */
  },
  setPreferredReadingFormat: () => {
    /* placeholder function */
  },
  setUserData: () => {
    /* placeholder function */
  },
  withHeaders: (fn) => (...args) => fn(...args, {}),
};