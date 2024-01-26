import React from 'react';

import {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { 
  NativeBottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { NavigationID, RoutingParams } from '~/screens';

const Tab = createBottomTabNavigator();

export type TabNavigatorProps = 
Omit<DefaultNavigatorOptions<
  RoutingParams,
  NavigationState,
  NativeBottomTabNavigationOptions,
  EventMapBase
>, 'children'> & {
  id: NavigationID;
  screens: RouteConfig<
    RoutingParams,
    keyof RoutingParams,
    NavigationState,
    NativeTabNavigationOptions,
    EventMapBase
  >[];
};

export function TabNavigator(
  { 
    id,
    initialRouteName = 'default',
    screenListeners,
    screenOptions,
    screens,
  }: TabNavigatorProps
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
