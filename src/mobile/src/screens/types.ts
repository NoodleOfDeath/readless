import React from 'react';

import { LinkingOptions } from '@react-navigation/native';

import { ReadingFormat, SummaryResponse } from '~/api';

export type RootParamList = {
  discover: {
    default: undefined;
    summary: {
      initialFormat: ReadingFormat;
      summary: SummaryResponse;
    };
  };
  myStuff: {
    default: undefined;
    category: {
      prefilter?: string,
    },
    summary: {
      initialFormat: ReadingFormat;
      summary: SummaryResponse;
    };
  };
  news: {
    default: undefined;
    category: {
      prefilter?: string,
    },
    summary: {
      initialFormat: ReadingFormat;
      summary: SummaryResponse;
    };
  };
  search: {
    default: undefined;
    prefilter?: string;
    summary: {
      initialFormat: ReadingFormat;
      summary: SummaryResponse;
    };
  };
  settings: {
    default: undefined;
  }
};

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RootParamList> = {
  config: {
    screens: {
      discover: { path: 'discover' },
      myStuff: { path: 'myStuff' },
      news: { path: 'news' },
      search: { path: 'search' },
      settings: { path: 'settings' },
    },
  },
  prefixes: [
    'https://www.readless.ai', 
    'https://readless.ai', 
    'readless://',
  ],
};

export type ScreenProps = {
  name: string;
  component: React.ComponentType;
  icon: string;
  headerRight?:
    | ((props: {
        tintColor?: string;
        pressColor?: string;
        pressOpacity?: number;
      }) => React.ReactNode)
    ;
};
