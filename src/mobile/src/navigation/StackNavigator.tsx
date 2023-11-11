import React from 'react';

import {
  DefaultNavigatorOptions,
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { NavigationID, RoutingParams } from '~/screens';

const Stack = createNativeStackNavigator();

export type StackNavigatorProps = 
Omit<DefaultNavigatorOptions<
  RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>, 'children'> & {
  id: NavigationID;
  screens: RouteConfig<
    RoutingParams,
    keyof RoutingParams,
    NavigationState,
    NativeStackNavigationOptions,
    EventMapBase
  >[];
};

export function StackNavigator(
  { 
    id,
    initialRouteName = 'default',
    screenListeners,
    screenOptions,
    screens,
  }: StackNavigatorProps
) {
  return (
    <Stack.Navigator 
      id={ id }
      initialRouteName={ initialRouteName }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      screenListeners={ screenListeners as any }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      screenOptions={ screenOptions as any }>
      {screens.map((screen) => (
        <Stack.Screen
          key={ String(screen.name) }
          { ...screen }
          options={ { 
            headerShown: true,
            ...screen.options,
          } } />
      ))}
    </Stack.Navigator>
  );
  
}
