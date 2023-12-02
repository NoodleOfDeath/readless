import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { RightToggles } from '../header';

import { strings } from '~/locales';
import {
  AchievementScreen,
  AchievementsScreen,
  CategoryScreen,
  LeaderboardsScreen,
  NotificationScreen,
  NotificationsScreen,
  PublisherScreen,
  RecapScreen,
  RoutingParams,
  SearchScreen,
  StatsScreen,
  SummaryListScreen,
  SummaryScreen,
  TestScreen,
} from '~/screens';

export const BASE_STACK: RouteConfig<
  RoutingParams,
  keyof RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
  {
    component: SearchScreen, 
    name: 'search',
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.search,
    },
  },
  {
    component: AchievementScreen, 
    name: 'achievement',
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: '', 
    },
  },
  {
    component: AchievementsScreen,
    name: 'achievements',
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.achievements, 
    },
  },
  {
    component: NotificationScreen, 
    name: 'notification',
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: '', 
    },
  },
  {
    component: NotificationsScreen, 
    name: 'notifications',
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.notifications, 
    },
  },
  {
    component: SummaryListScreen, 
    name: 'summaryList',
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => <RightToggles />,
      headerTitle: '', 
    },
  },
  {
    component: SummaryScreen, 
    name: 'summary',  
    options: { 
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: '', 
    },
  },
  {
    component: RecapScreen,
    name: 'recap',  
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: '', 
    },
  },
  {
    component: CategoryScreen, 
    name: 'category',
    options: { 
      headerBackTitle: '', 
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: '', 
    },
  },
  {
    component: PublisherScreen, 
    name: 'publisher',
    options: {
      headerBackTitle: '', 
      headerLeft: () => null,
      headerRight: () => null,
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
];