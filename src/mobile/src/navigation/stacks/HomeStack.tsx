import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { ACCOUNT_STACK } from './AccountStack';
import { BASE_STACK } from './BaseStack';
import { SETTINGS_STACK } from './SettingsStack';

import { DrawerToggle, RightToggles } from '~/navigation';
import { HomeScreen, RoutingParams } from '~/screens';

export const HOME_STACK: RouteConfig<
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
      headerLeft: () => <DrawerToggle />,
      headerRight: () => <RightToggles />,
      headerTitle: '',
    },
  },
  ...BASE_STACK,
  ...ACCOUNT_STACK,
  ...SETTINGS_STACK,
];