import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { GAMES_STACK, NEWS_STACK } from './stacks';

import { Icon } from '~/components';
import { RoutedScreen, StackNavigator } from '~/navigation';
import { RoutingParams } from '~/screens';

const Tab = createBottomTabNavigator<RoutingParams>();

function NewsStack() {
  return (
    <RoutedScreen safeArea={ false } navigationID='newsStackNav'>
      <StackNavigator id="newsStackNav" screens={ NEWS_STACK } />
    </RoutedScreen>
  );
}

function GamesStack() {
  return (
    <RoutedScreen safeArea={ false } navigationID='gamesStackNav'>
      <StackNavigator id="gamesStackNav" screens={ GAMES_STACK } />
    </RoutedScreen>
  );
}

export function TabbedNavigator() {
  return (
    <Tab.Navigator
      screenOptions={ { headerShown: false } }
      tabBar={ () => null }>
      <Tab.Screen 
        name="news"
        component={ NewsStack }
        options={ {
          tabBarIcon: ({ color, size }) => (
            <Icon name="newspaper-variant" color={ color } size={ size } />
          ),
          title: 'News',
        } } />
      <Tab.Screen 
        name="games"
        component={ GamesStack }
        options={ {
          tabBarIcon: ({ color, size }) => (
            <Icon name="gamepad-variant" color={ color } size={ size } />
          ),
          title: 'Games',
        } } />
    </Tab.Navigator>
  );
}