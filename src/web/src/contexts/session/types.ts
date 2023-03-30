import { Theme } from '@emotion/react';
import { PaletteMode } from '@mui/material';
import jwt from 'jsonwebtoken';

import { LoginResponse, RequestParams } from '@/api';
import { ConsumptionMode } from '@/components/Summary';
import { loadTheme } from '@/theme';

export type Preferences = {
  displayMode?: PaletteMode;
  consumptionMode?: ConsumptionMode;
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
  preferences: Preferences;
  userData?: UserData;
  // getters
  displayMode?: PaletteMode;
  consumptionMode?: ConsumptionMode;
  searchText: string;
  searchOptions: string[];
  // setters
  setUserData: (state?: UserDataProps | ((state?: UserDataProps) => UserDataProps | undefined), options?: SetSessionOptions) => void;
  addUserToken: (token: LoginResponse['token']) => void;
  setDisplayMode: React.Dispatch<React.SetStateAction<PaletteMode | undefined>>;
  setConsumptionMode: React.Dispatch<
    React.SetStateAction<ConsumptionMode | undefined>
  >;
  setSearchText: (
    state: React.SetStateAction<string>,
    opts?: SetSearchTextOptions
  ) => void;
  setSearchOptions: React.Dispatch<React.SetStateAction<string[]>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const NULL_SESSION: Session = {
  addUserToken: () => {
    /* placeholder function */
  },
  
  consumptionMode: 'concise',
  // getters
  displayMode: 'light',
  preferences: {},
  searchOptions: [],
  searchText: '',
  setConsumptionMode: () => {
    /* placeholder function */
  },
  setDisplayMode: () => {
    /* placeholder function */
  },
  setSearchOptions: () => {
    /* placeholder function */
  },
  setSearchText: () => {
    /* placeholder function */
  },
  setUserData: () => {
    /* placeholder function */
  },
  theme: loadTheme(),
  withHeaders: (fn) => (...args) => fn(...args, {}),
};