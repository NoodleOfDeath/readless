import React from 'react';

import { UserData, UserDataProps } from './UserData';

import {
  LoginResponse,
  ReadingFormat,
  RequestParams,
  SummaryResponse,
} from '~/api';

export type ColorMode = 'light' | 'dark';

export type SummaryBookmarkKey = `${'summary'}:${number}`;

export class SummaryBookmark {

  summary: SummaryResponse;
  createdAt: Date;

  get serialized() {
    return {
      createdAt: this.createdAt,
      summary: this.summary,
    };
  }

  constructor(summary: SummaryResponse) {
    this.summary = summary;
    this.createdAt = new Date();
  }

}

export type Preferences = {
  displayMode?: ColorMode;
  lastReleaseNotesDate?: string;
  preferredReadingFormat?: ReadingFormat;
  compactMode?: boolean;
  bookmarks?: { 
    [key in SummaryBookmarkKey]: key extends SummaryBookmarkKey ? SummaryBookmark : never
  };
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