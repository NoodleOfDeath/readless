import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { SETTINGS_STACK } from './SettingsStack';

import { strings } from '~/locales';
import { SearchViewController, SettingsToggleWithIndicator } from '~/navigation';
import {
  CategoryScreen,
  HomeScreen,
  PublisherScreen,
  RecapScreen,
  RoutingParams,
  SearchScreen,
  StatsScreen,
  SummaryScreen,
  TestScreen,
} from '~/screens';
import { LeaderboardsScreen } from '~/screens/profile/LeaderboardsScreen';

export const NEWS_STACK: RouteConfig<
  RoutingParams,
  keyof RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
  // Home Tab
  {
    component: HomeScreen, 
    name: 'home',
    options: { 
      headerBackTitle: '',
      headerLeft: () => <SearchViewController />,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '',
    },
  },
  // Screens
  {
    component: SearchScreen, 
    name: 'search',
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: SummaryScreen, 
    name: 'summary',  
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: RecapScreen,
    name: 'recap',  
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: CategoryScreen, 
    name: 'category',
    options: { 
      headerBackTitle: '', 
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: PublisherScreen, 
    name: 'publisher',
    options: {
      headerBackTitle: '', 
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: LeaderboardsScreen, 
    name: 'leaderboards',
    options: { 
      headerBackTitle: '', 
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.leaderboard,
    },
  },
  // Other
  {
    component: StatsScreen,
    name: 'stats',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: 'stats',
    },
  },
  {
    component: TestScreen,
    name: 'test',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: 'test', 
    },
  },
  ...SETTINGS_STACK,
];