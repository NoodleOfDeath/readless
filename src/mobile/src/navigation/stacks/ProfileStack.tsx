import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { strings } from '~/locales';
import { SettingsToggleWithIndicator } from '~/navigation';
import {
  ProfileScreen,
  RoutingParams,
  SettingsScreen,
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
      headerRight: () => <SettingsToggleWithIndicator />, 
    },
  },
  {
    component: SettingsScreen,
    name: 'settings',
    options: {
      headerBackTitle: '',
      headerTitle: strings.screens_settings,
    },
  },
];