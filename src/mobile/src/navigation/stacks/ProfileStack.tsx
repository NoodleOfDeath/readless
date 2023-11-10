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
  BookmarksScreen,
  CategoryScreen,
  ProfileScreen,
  PublisherScreen,
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
      headerRight: () => <SettingsToggleWithIndicator />, 
      headerTitle: strings.screens_profile,
    },
  },
  {
    component: BookmarksScreen, 
    name: 'bookmarks', 
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => <SettingsToggleWithIndicator />,
      headerTitle: strings.screens_bookmarks, 
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
  ...SETTINGS_STACK,
];