import React from 'react';

import { UserData, UserDataProps } from './UserData';

import {
  LoginResponse,
  PublicCategoryAttributes,
  PublicOutletAttributes,
  PublicSummaryAttributes,
  ReadingFormat,
  ReleaseAttributes,
  RequestParams,
} from '~/api';

export type ColorMode = 'light' | 'dark';

export class Bookmark<T> {

  item: T;
  createdAt: Date;
  
  get serialized() {
    return {
      createdAt: this.createdAt,
      item: this.item,
    };
  }

  constructor(item: T) {
    this.item = item;
    this.createdAt = new Date();
  }

}

export type Preferences = {
  displayMode?: ColorMode;
  releases?: Record<string, ReleaseAttributes>;
  alwaysShowReadingFormatSelector?: boolean;
  preferredReadingFormat?: ReadingFormat;
  compactMode?: boolean;
  textScale?: number;
  fontFamily?: string;
  sortOrder?: string[];
  bookmarkedSummaries?: { [key: number]: Bookmark<PublicSummaryAttributes> };
  favoritedSummaries?: { [key: number]: Bookmark<PublicSummaryAttributes> };
  bookmarkedCategories?: { [key: string]: Bookmark<PublicCategoryAttributes> };
  bookmarkedOutlets?: { [key: string]: Bookmark<PublicOutletAttributes> };
  removedSummaries?: { [key: number]: Bookmark<PublicSummaryAttributes> };
  readSummaries?: { [key: number]: Bookmark<PublicSummaryAttributes> };
  showOnlyBookmarkedNews?: boolean;
};

export const DEFAULT_PREFERENCES: Partial<Preferences> = { 
  fontFamily: 'Alegreya',
  sortOrder: ['originalDate:desc'],
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
  setPreference<Key extends keyof Preferences>(key: Key, value: React.SetStateAction<Preferences[Key]>): void;
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