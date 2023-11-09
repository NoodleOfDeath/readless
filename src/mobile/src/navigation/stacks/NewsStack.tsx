import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { SETTINGS_STACK } from './SettingsStack';

import { strings } from '~/locales';
import {
  BookmarksScreen,
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
import {
  DrawerToggleWithIndicator,
  SearchMenu,
  SettingsToggleWithIndicator,
} from '~/screens';

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
      headerLeft: () => <DrawerToggleWithIndicator />,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: () => <SearchMenu />,
    },
  },
  // Screens
  {
    component: SearchScreen, 
    name: 'search',
    options: { 
      headerBackTitle: '',
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: SummaryScreen, 
    name: 'summary',  
    options: { 
      headerBackTitle: '',
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: RecapScreen,
    name: 'recap',  
    options: {
      headerBackTitle: '',
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: CategoryScreen, 
    name: 'category',
    options: { 
      headerBackTitle: '', 
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: PublisherScreen, 
    name: 'publisher',
    options: {
      headerBackTitle: '', 
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '', 
    },
  },
  {
    component: BookmarksScreen, 
    name: 'bookmarks', 
    options: {
      headerBackTitle: '',
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: strings.screens_bookmarks, 
    }, 
  }, 
  // Other
  {
    component: StatsScreen,
    name: 'stats',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined,
      headerTitle: 'stats',
    },
  },
  {
    component: TestScreen,
    name: 'test',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined,
      headerTitle: 'test', 
    },
  },
  ...SETTINGS_STACK,
];