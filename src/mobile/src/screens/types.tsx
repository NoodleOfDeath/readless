import React from 'react';

import { LinkingOptions } from '@react-navigation/native';

import { ReadingFormat, SummaryResponse } from '~/api';

export type RootParamList = {
  discover: {
    search: undefined;
    summary: {
      format?: ReadingFormat;
      summary?: SummaryResponse;
    };
  };
  settings: undefined;
};

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RootParamList> = {
  config: {
    screens: {
      discover: { path: 'discover' },
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
