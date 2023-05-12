import React from 'react';

import {
  LinkingOptions,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  PublicCategoryAttributes,
  PublicOutletAttributes,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';

export type TabParams = {
  default: undefined;
};

export type StackableTabParams = TabParams & {
  search: {
    prefilter?: string,
    onlyCustomNews?: boolean;
    specificIds?: number[];
    noHeader?: boolean;
  },
  summary: {
    initialFormat: ReadingFormat;
    keywords?: string[];
    summary: PublicSummaryAttributes | number;
  };
  outlet: {
    outlet: PublicOutletAttributes;
  }
  category: {
    category: PublicCategoryAttributes;
  }
  bookmarks: undefined;
};

export type RootParamList = {
  // Tabs
  headlinesTab: StackableTabParams;
  myNewsTab: StackableTabParams;
  browseTab: StackableTabParams;
};

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RootParamList> = {
  config: {
    screens: {
      browseTab: { path: 'browse' },
      headlinesTab: { path: 'headlines' },
      myNewsTab: { path: 'my-news' },
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

export type ScreenProps<Path extends keyof StackableTabParams = keyof StackableTabParams, C extends React.ComponentType = React.ComponentType> = {
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
  route?: RouteProp<StackableTabParams, Path> 
  navigation?: NativeStackNavigationProp<StackableTabParams, Path>
};
