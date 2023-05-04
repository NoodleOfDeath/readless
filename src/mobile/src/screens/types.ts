import React from 'react';

import {
  LinkingOptions,
  ParamListBase,
  RouteProp,
  TabNavigationState,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PublicSummaryAttributes, ReadingFormat } from '~/api';

export type TabParams = {
  default: undefined;
};

export type StackableTabParams = TabParams & {
  search: {
    prefilter?: string,
    onlyCustomNews?: boolean;
    specificIds?: number[];
  },
  summary: {
    initialFormat: ReadingFormat;
    keywords?: string[];
    summary: PublicSummaryAttributes | number;
  };
};

export type RootParamList = {
  // Tabs
  bulletinTab: StackableTabParams;
  myStuffTab: StackableTabParams;
  todayTab: StackableTabParams;
  browseTab: StackableTabParams;
  settingsTab: TabParams;
};

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RootParamList> = {
  config: {
    screens: {
      browseTab: { path: 'browse' },
      bulletinTab: { path: 'bulletin' },
      myStuffTab: { path: 'my-stuff' },
      settingsTab: { path: 'settings' },
      todayTab: { path: 'today' },
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

export type TabProps = {
  route: RouteProp<StackableTabParams>;
  navigation: TabNavigationState<RootParamList>;
};
