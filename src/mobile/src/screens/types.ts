import React from 'react';

import {
  LinkingOptions,
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
  },
  summary: {
    initialFormat: ReadingFormat;
    summary: PublicSummaryAttributes;
  };
};

export type RootParamList = {
  // Tabs
  myStuffTab: StackableTabParams;
  realtimeTab: StackableTabParams;
  sectionsTab: StackableTabParams;
  settingsTab: {
    default: undefined;
  };
};

export const NAVIGATION_LINKING_OPTIONS: LinkingOptions<RootParamList> = {
  config: {
    screens: {
      myStuffTab: { path: 'my-stuff' },
      realtimeTab: { path: 'hot-off-press' },
      sectionsTab: { path: 'sections' },
      settingsTab: { path: 'settings' },
    },
  },
  prefixes: [
    'https://www.readless.ai', 
    'https://readless.ai', 
    'readless://',
  ],
};

export type ScreenProps<Path extends keyof StackableTabParams = keyof StackableTabParams, C extends React.ComponentType = React.ComponentType> = {
  name: Path;
  component: C;
  icon?: string;
  headerRight?:
    | ((props: {
        tintColor?: string;
        pressColor?: string;
        pressOpacity?: number;
      }) => React.ReactNode)
    ;
  route: RouteProp<StackableTabParams, Path> 
  navigation: NativeStackNavigationProp<StackableTabParams, Path>
};

export type TabProps = {
  route: RouteProp<StackableTabParams>;
  navigation: TabNavigationState<RootParamList>;
};
