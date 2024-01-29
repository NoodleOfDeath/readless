import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { BASE_STACK } from './BaseStack';

import { LeftTabBarIcons, RightTabBarIcons } from '~/navigation';
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
      headerLeft: () => <LeftTabBarIcons />,
      headerRight: () => <RightTabBarIcons />,
      headerTitle: '',
    },
  },
  ...BASE_STACK,
];

export const HOME_STACK_KEYS = HOME_STACK.map(({ name }) => name);