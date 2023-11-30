import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { BASE_STACK } from './BaseStack';
import { SETTINGS_STACK } from './SettingsStack';

import { strings } from '~/locales';
import {
  AccountScreen,
  BookmarksScreen,
  ProfileScreen,
  RoutingParams,
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
      headerRight: () => null, 
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
      headerRight: () => null,
      headerTitle: strings.bookmarks, 
    }, 
  }, 
  ...BASE_STACK,
  ...SETTINGS_STACK,
];