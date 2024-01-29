import React from 'react';

import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { SearchTabBarIcon } from '~/navigation';
import { RoutingParams } from '~/screens';
import { GamesSelectionScreen } from '~/screens/games';
import { PlayGameScreen } from '~/screens/games/PlayGameScreen';

export const GAMES_STACK: RouteConfig<
  RoutingParams,
  keyof RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
  {
    component: GamesSelectionScreen, 
    name: 'default',
    options: {
      headerBackTitle: '',
      headerRight: () => <SearchTabBarIcon />, 
    },
  },
  {
    component: PlayGameScreen,
    name: 'play',
    options: {
      headerBackTitle: '',
      headerRight: () => <SearchTabBarIcon />, 
    },
  },
];