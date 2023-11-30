import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { strings } from '~/locales';
import {
  AccountScreen,
  BookmarksScreen,
  RoutingParams,
} from '~/screens';

export const ACCOUNT_STACK: RouteConfig<
  RoutingParams,
  keyof RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
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
];