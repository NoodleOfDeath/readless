import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { BASE_STACK } from './BaseStack';
import { SETTINGS_STACK } from './SettingsStack';

import { RightToggles } from '~/navigation';
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
      headerLeft: () => null,
      headerRight: () => <RightToggles />,
      headerTitle: '',
    },
  },
  ...BASE_STACK,
  ...SETTINGS_STACK,
];