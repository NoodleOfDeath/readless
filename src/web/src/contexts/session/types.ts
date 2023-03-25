import { Theme } from '@emotion/react';
import { PaletteMode } from '@mui/material';

import { LoginResponse } from '@/api';
import { ConsumptionMode } from '@/components/Post';
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

export type SetSessionOptions = {
  updateCookie?: boolean;
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

  constructor({
    userId, 
    token, 
    tokens = token ? [token] : [],
    isLoggedIn = false, 
  }: UserDataProps) {
    this.userId = userId;
    this.tokens = (Array.isArray(tokens) ? tokens : [tokens]).sort((a, b) => b.priority - a.priority);
    this.isLoggedIn = isLoggedIn;
  }

  stringify() {
    return JSON.stringify({
      isLoggedIn: this.isLoggedIn,
      tokens: this.tokens,
      userId: this.userId,
    });
  }

}

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
  setDisplayMode: React.Dispatch<React.SetStateAction<PaletteMode | undefined>>;
  setConsumptionMode: React.Dispatch<
    React.SetStateAction<ConsumptionMode | undefined>
  >;
  setSearchText: (
    state: React.SetStateAction<string>,
    opts?: SetSearchTextOptions
  ) => void;
  setSearchOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

export const NULL_SESSION: Session = {
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
};