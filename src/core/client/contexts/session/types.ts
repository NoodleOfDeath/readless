import React from 'react';

import { UserData, UserDataProps } from './UserData';

import {
  InteractionType,
  LoginResponse,
  PublicCategoryAttributes,
  PublicOutletAttributes,
  PublicSummaryAttributes,
  ReadingFormat,
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

  constructor(item: T, createdAt = new Date()) {
    this.item = item;
    this.createdAt = createdAt;
  }

}

export type Preferences = {
  displayMode?: ColorMode;
  alwaysShowReadingFormatSelector?: boolean;
  preferredReadingFormat?: ReadingFormat;
  compactMode?: boolean;
  textScale?: number;
  homeTab?: 'All News' | 'My News',
  fontFamily?: string;
  letterSpacing?: number;
  sortOrder?: string[];
  searchHistory?: string[];
  searchCanMatchAny?: boolean;
  showShortSummary?: boolean;
  bookmarkedSummaries?: { [key: number]: Bookmark<PublicSummaryAttributes> };
  favoritedSummaries?: { [key: number]: Bookmark<boolean> };
  bookmarkedCategories?: { [key: string]: Bookmark<PublicCategoryAttributes> };
  bookmarkedOutlets?: { [key: string]: Bookmark<PublicOutletAttributes> };
  removedSummaries?: { [key: number]: Bookmark<boolean> };
  readSummaries?: { [key: number]: Bookmark<boolean> };
  readSources?: { [key: number]: Bookmark<boolean> };
  summaryHistory?: { [key: number]: Bookmark<InteractionType> };
  showOnlyBookmarkedNews?: boolean;
};

export const DEFAULT_PREFERENCES: Partial<Preferences> = { sortOrder: ['originalDate:desc'] };

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
  followOutlet: (outlet: PublicOutletAttributes) => void;
  followCategory: (category: PublicCategoryAttributes) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const DEFAULT_SESSION_CONTEXT: SessionContextType = {
  addUserToken: () => {
    /* placeholder function */
  },
  followCategory: () => {
    /* placeholder function */
  },
  followOutlet: () => {
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