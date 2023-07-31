import React from 'react';

import {
  LinkingOptions,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  ReadingFormat,
  RecapAttributes,
} from '~/api';

export type RoutingParams = {
  // main
  default: undefined;
  home: undefined;
  // tabs
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
  // settings and pickers
  settings: undefined;
  colorSchemePicker: undefined;
  fontPicker: undefined;
  triggerWordPicker: undefined;
  shortPressFormatPicker: undefined;
  readingFormatPicker: undefined;
  // other
  stats: undefined;
  test: undefined;
};

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

export type ScreenComponentType<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> =
  | React.ComponentType<{
      route: RouteProp<ParamList, RouteName>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation: any;
    }>
  // eslint-disable-next-line @typescript-eslint/ban-types
  | React.ComponentType<{}>;

export type ScreenProps<Path extends keyof RoutingParams = keyof RoutingParams, C extends React.ComponentType = React.ComponentType> = {
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
