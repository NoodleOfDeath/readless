import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { SETTINGS_STACK } from './SettingsStack';

import { strings } from '~/locales';
import { SettingsToggleWithIndicator } from '~/navigation';
import {
  AccountScreen,
  BookmarksScreen,
  CategoryScreen,
  ProfileScreen,
  PublisherScreen,
  RoutingParams,
  SummaryScreen,
} from '~/screens';

export const PROFILE_STACK: RouteConfig<
  RoutingParams,
  keyof RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
  {
    component: ProfileScreen, 
    name: 'default',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />, 
      headerTitle: strings.profile,
    },
  },
  {
    component: AccountScreen, 
    name: 'account',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null, 
      headerTitle: strings.account,
    },
  },
  {
    component: BookmarksScreen, 
    name: 'bookmarks', 
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: strings.bookmarks, 
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
    component: CategoryScreen, 
    name: 'category',
    options: { 
      headerBackTitle: '', 
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: '',
    },
  },
  ...SETTINGS_STACK,
];