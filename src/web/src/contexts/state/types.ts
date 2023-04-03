import { Theme } from '@emotion/react';
import { PaletteMode } from '@mui/material';
import jwt from 'jsonwebtoken';

import {
  LoginResponse,
  ReadingFormat,
  RequestParams,
} from '~/api';
import { loadTheme } from '~/theme';

export type Preferences = {
  displayMode?: PaletteMode;
  preferredReadingFormat?: ReadingFormat;
};

export type UserDataProps = {
  userId: number;
  isLoggedIn?: boolean;
  token?: LoginResponse['token'];
  tokens?: LoginResponse['token'] | LoginResponse['token'][];
};

export class UserData implements UserDataProps {

  userId: number;
  isLoggedIn?: boolean;
  tokens: LoginResponse['token'][];

  get token() {
    if (this.tokens.length === 0) {
      return undefined;
    }
    return this.tokens[0];
  }

  get tokenString() {
    return this.token?.value;
  }

  get expired() {
    return this.tokens.length > 0 && this.tokens.every((t) => UserData.tokenHasExpired(t.value));
  }
  
  static tokenHasExpired(tokenString: string) {
    const token = jwt.decode(tokenString);
    if (!token || typeof token === 'string' || !token.exp) {
      return true;
    }
    return token.exp < Date.now() / 1_000;
  }

  constructor({
    userId, 
    token, 
    tokens = token ? [token] : [],
    isLoggedIn = false, 
  }: UserDataProps) {
    this.userId = userId;
    this.tokens = (Array.isArray(tokens) ? tokens : [tokens]).filter((t) => !UserData.tokenHasExpired(t.value)).sort((a, b) => b.priority - a.priority);
    this.isLoggedIn = isLoggedIn;
  }
  
  addToken(token: LoginResponse['token']) {
    this.tokens = [...this.tokens, token].filter((t) => !UserData.tokenHasExpired(t.value)).sort((a, b) => b.priority - a.priority);
  }

}

// Headers

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

// Context

export type SetSessionOptions = {
  updateCookie?: boolean;
};

export type SetSearchTextOptions = {
  clearSearchParams?: boolean;
};

export type Session = {
  theme: Theme;
  // app ui state
  showLoginDialog: boolean;
  setShowLoginDialog: (state: React.SetStateAction<boolean>, deferredAction?: () => void) => void;
  // search text
  searchText: string;
  setSearchText: (
    state: React.SetStateAction<string>,
    opts?: SetSearchTextOptions
  ) => void;
  searchOptions: string[];
  setSearchOptions: React.Dispatch<React.SetStateAction<string[]>>;
  // session state
  userData?: UserData;
  setUserData: (state?: UserDataProps | ((state?: UserDataProps) => UserDataProps | undefined), options?: SetSessionOptions) => void;
  addUserToken: (token: LoginResponse['token']) => void;
  // preferences
  preferences: Preferences;
  // getters
  displayMode?: PaletteMode;
  setDisplayMode: React.Dispatch<React.SetStateAction<PaletteMode | undefined>>;
  preferredReadingFormat?: ReadingFormat;
  setPreferredReadingFormat: React.Dispatch<
    React.SetStateAction<ReadingFormat | undefined>
  >;
  // session hooks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const NULL_SESSION: Session = {
  addUserToken: () => {
    /* placeholder function */
  },
  displayMode: 'light',
  preferences: {},
  preferredReadingFormat: ReadingFormat.Concise,
  searchOptions: [],
  searchText: '',
  setDisplayMode: () => {
    /* placeholder function */
  },
  setPreferredReadingFormat: () => {
    /* placeholder function */
  },
  setSearchOptions: () => {
    /* placeholder function */
  },
  setSearchText: () => {
    /* placeholder function */
  },
  setShowLoginDialog: () => {
    /* placeholder function */
  },
  setUserData: () => {
    /* placeholder function */
  },
  showLoginDialog: false,
  theme: loadTheme(),
  withHeaders: (fn) => (...args) => fn(...args, {}),
};