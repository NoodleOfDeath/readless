import React from 'react';

import { LinkingOptions, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  InteractionType,
  MetricsResponse,
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  ReadingFormat,
  RecapAttributes,
  SystemNotificationAttributes,
  UserAchievementAttributes,
} from '~/api';

export type NavigationID = `${string}DrawerNav` | `${string}StackNav` | `${string}TabNav`;

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
  generalSettings: undefined;
  displayPreferences: undefined;
  notificationSettings: undefined;
  colorSchemePicker: undefined;
  fontPicker: undefined;
  publisherPicker: undefined;
  categoryPicker: undefined;
  shortPressFormatPicker: undefined;
  readingFormatPicker: undefined;
  triggerWordPicker: undefined;
};

export type NewsRoutingParams = {
  // main
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
    prefilter?: string;
  };
  notification: {
    notification: SystemNotificationAttributes;
  };
  notifications: undefined;
  summaryList: {
    prefilter?: string,
    specificIds?: number[];
  };
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
  play: {
    name: string;
  }
};

export type ProfileRoutingParams = {
  account: undefined;
  achievements: undefined;
  achievement: UserAchievementAttributes;
  leaderboard: { 
    metrics: MetricsResponse;
    title?: string;
    unit?: string;
  };
  leaderboards: undefined;
};

export type RoutingParams = GamesRoutingParams & LoginRoutingParams & NewsRoutingParams & ProfileRoutingParams & SettingsRoutingParams;

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RoutingParams> = {
  config: {
    screens: {
      bookmarks: { path: 'bookmarks' },
      category: { path: 'category' },
      generalSettings: { path: 'generalSettings' },
      publisher: { path: 'publisher' },
      search: { path: 'search' },
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
