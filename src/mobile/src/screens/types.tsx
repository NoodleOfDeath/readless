import React from 'react';

import { LinkingOptions } from '@react-navigation/native';

import { ReadingFormat, SummaryResponse } from '~/api';

export type RootParamList = {
  discover: {
    home: undefined;
    summary: {
      format?: ReadingFormat;
      summary?: SummaryResponse;
    };
  };
  notifications: {
    notifications: undefined;
  };
  profile: {
    login: undefined;
    signup: undefined;
    profile: undefined;
    account: undefined;
    settings: undefined;
  }
  search: {
    search: undefined;
    summary: {
      format?: ReadingFormat;
      summary?: SummaryResponse;
    };
  };
};

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RootParamList> = {
  config: {
    screens: {
      discover: { path: 'discover' },
      notifications: { path: 'notifications' },
      profile: { path: 'profile' },
      search: { path: 'search' },
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
