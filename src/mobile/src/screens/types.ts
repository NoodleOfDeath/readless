import React from 'react';

import { LinkingOptions, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  ReadingFormat,
  RecapAttributes,
} from '~/api';

export type NavigationID = `${string}StackNav` | `${string}TabNav` | `${string}DrawerNav`;

export type NavigationTabParams = {
  news: undefined;
  games: undefined;
  profile: undefined;
};

export type LoginRoutingParams = {
  login: undefined;
  passwordLogin: { email?: string };
  register: { email?: string };
  forgotPassword: { email?: string };
  verifyOtp: { otp?: string, code: string };
  setNewPassword: undefined;
};

export type SettingsRoutingParams = {
  // settings and pickers
  settings: undefined;
  notifications: undefined;
  colorSchemePicker: undefined;
  fontPicker: undefined;
  publisherPicker: undefined;
  categoryPicker: undefined;
  shortPressFormatPicker: undefined;
  readingFormatPicker: undefined;
  triggerWordPicker: undefined;
};

export type NewsRoutingParams = SettingsRoutingParams & {
  // main
  default: undefined;
  home: undefined;
  // top-tabs
  oldNews: undefined;
  topStories: undefined;
  yourNews: undefined;
  liveFeed: undefined;
  // screens
  bookmarks: undefined;
  category: {
    category: PublicCategoryAttributes;
  };
  publisher: {
    publisher: PublicPublisherAttributes;
  };
  legal: undefined;
  recap: {
    recap: RecapAttributes;
  };
  search: {
    prefilter?: string,
    specificIds?: number[];
  },
  summary: {
    initialFormat?: ReadingFormat;
    keywords?: string[];
    summary: PublicSummaryGroup | number;
    showAnalytics?: boolean;
  };
  // other
  stats: undefined;
  test: undefined;
};

export type GamesRoutingParams = {
  default: undefined;
  play: {
    name: string;
  }
};

export type ProfileRoutingParams = SettingsRoutingParams & {
  default: undefined;
  account: undefined;
};

export type RoutingParams = NavigationTabParams & LoginRoutingParams & NewsRoutingParams & GamesRoutingParams & ProfileRoutingParams;

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RoutingParams> = {
  config: {
    screens: {
      bookmarks: { path: 'bookmarks' },
      category: { path: 'category' },
      default: { path: '' },
      publisher: { path: 'publisher' },
      search: { path: 'search' },
      settings: { path: 'settings' },
      summary: { path: 'summary' },
    },
  },
  prefixes: [
    '/',
    'https://dev.readless.ai',
    'https://readless.ai', 
    'https://www.readless.ai', 
    'readless://',
  ],
};

export type ScreenComponent<Path extends keyof RoutingParams = keyof RoutingParams, C extends React.ComponentType = React.ComponentType> = {
  name?: Path;
  component?: C;
  icon?: string;
  headerRight?:
    | ((props: {
        tintColor?: string;
        pressColor?: string;
        pressOpacity?: number;
      }) => React.ReactNode)
    ;
  route?: RouteProp<RoutingParams, Path> 
  navigation?: NativeStackNavigationProp<RoutingParams, Path>
};
