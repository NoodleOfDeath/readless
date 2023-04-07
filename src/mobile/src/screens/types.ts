import React from 'react';

import { LinkingOptions } from '@react-navigation/native';

import { ReadingFormat, SummaryResponse } from '~/api';

export type RootParamList = {
  // Tabs
  discoverTab: {
    default: undefined;
    summary: {
      initialFormat: ReadingFormat;
      summary: SummaryResponse;
    };
  };
  newsTab: {
    default: undefined;
    search: {
      prefilter?: string,
    },
    summary: {
      initialFormat: ReadingFormat;
      summary: SummaryResponse;
    };
  };
  myStuffTab: {
    default: undefined;
    search: {
      prefilter?: string,
    },
    summary: {
      initialFormat: ReadingFormat;
      summary: SummaryResponse;
    };
  };
  searchTab: {
    default: undefined;
    search: {
      prefilter?: string;
    };
    summary: {
      initialFormat: ReadingFormat;
      summary: SummaryResponse;
    };
  };
  settingsTab: {
    default: undefined;
  }

  // Screens
  searchScreen: {
    prefilter?: string;
  };
  summaryScreen: {
    initialFormat: ReadingFormat;
    summary: SummaryResponse;
  }
};

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RootParamList> = {
  config: {
    screens: {
      discoverTab: { path: 'discover' },
      myStuffTab: { path: 'myStuff' },
      newsTab: { path: 'news' },
      searchTab: { path: 'search' },
      settingsTab: { path: 'settings' },
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

export type Tab = 'discoverTab' | 'newsTab' | 'myStuffTab' | 'searchTab' | 'settingsTab';