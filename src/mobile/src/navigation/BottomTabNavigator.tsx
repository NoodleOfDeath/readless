import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { LeftTabBarIcons, RightTabBarIcons } from './TabBarIcons';

import { Icon } from '~/components';
import { strings } from '~/locales';
import { GamesSelectionScreen, HomeScreen } from '~/screens';

const BottomTab = createBottomTabNavigator(); 

export const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="home"
        component={ HomeScreen }
        options={ {
          headerLeft: () => <LeftTabBarIcons />,
          headerRight: () => <RightTabBarIcons />,
          headerShown: true,
          headerTitle: '',
          tabBarAccessibilityLabel: strings.home,
          tabBarIcon: () => <Icon name='home' size={ 24 } />,
          tabBarLabel: strings.home,
          tabBarShowLabel: false,
        } } />
      {__DEV__ && (
        <BottomTab.Screen
          name="selectGame"
          component={ GamesSelectionScreen }
          options={ {
            headerLeft: () => null,
            headerRight: () => null,
            headerShown: true,
            headerTitle: '',
            tabBarAccessibilityLabel: strings.play,
            tabBarIcon: () => <Icon name='controller-classic' size={ 24 } />,
            tabBarLabel: strings.play,
          } } />
      )}
    </BottomTab.Navigator>
  );
};