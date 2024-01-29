import React from 'react';

import { 
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';

import { NavigationID, RoutingParams } from '~/screens';

const Tab = createBottomTabNavigator();

export type BottomTabNavigatorProps = 
Omit<DefaultNavigatorOptions<
  RoutingParams,
  NavigationState,
  BottomTabNavigationOptions,
  EventMapBase
>, 'children'> & {
  id: NavigationID;
  screens: RouteConfig<
    RoutingParams,
    keyof RoutingParams,
    NavigationState,
    BottomTabNavigationOptions,
    EventMapBase
  >[];
};

export function BottomTabNavigator(
  { 
    id,
    initialRouteName = 'home',
    screenListeners,
    screenOptions,
    screens,
  }: BottomTabNavigatorProps
) {
  return (
    <Tab.Navigator 
      id={ id }
      initialRouteName={ initialRouteName }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      screenListeners={ screenListeners as any }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      screenOptions={ screenOptions as any }>
      {screens.map((screen) => (
        <Tab.Screen
          key={ String(screen.name) }
          { ...screen }
          options={ { 
            headerShown: false,
            ...screen.options,
          } } />
      ))}
    </Tab.Navigator>
  );
  
}
