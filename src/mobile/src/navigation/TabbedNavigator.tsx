import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  GAMES_STACK,
  NEWS_STACK,
  PROFILE_STACK,
} from './stacks';

import { Button, Icon } from '~/components';
import { StorageContext } from '~/core';
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

function ProfileStack() {
  return (
    <RoutedScreen safeArea={ false } navigationID='profileStackNav'>
      <StackNavigator id="profileStackNav" screens={ PROFILE_STACK } />
    </RoutedScreen>
  );
}

function _GamesStack() {
  return (
    <RoutedScreen safeArea={ false } navigationID='gamesStackNav'>
      <StackNavigator id="gamesStackNav" screens={ GAMES_STACK } />
    </RoutedScreen>
  );
}

export function TabbedNavigator() {

  const { unreadBookmarkCount, hasViewedFeature } = React.useContext(StorageContext);

  return (
    <Tab.Navigator
      screenOptions={ { headerShown: false } }>
      <Tab.Screen 
        name="news"
        component={ NewsStack }
        options={ {
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={ color } size={ size } />
          ),
          tabBarLabel: () => null,
        } } />
      {/* <Tab.Screen 
        name="games"
        component={ GamesStack }
        options={ {
          tabBarIcon: ({ color, size }) => (
            <Icon name="gamepad-variant" color={ color } size={ size } />
          ),
          title: 'Games',
        } } /> */}
      <Tab.Screen 
        name="profile"
        component={ ProfileStack }
        options={ {
          tabBarIcon: ({ color, size }) => (
            <Button 
              indicator={ 
                (unreadBookmarkCount > 0 && !hasViewedFeature('bookmarks')) || 
                !hasViewedFeature('push-notifications') ||
                !hasViewedFeature('display-preferences') ||
                !hasViewedFeature('categories') ||
                !hasViewedFeature('publishers') ||
                !hasViewedFeature('app-review')
              }
              leftIcon="account"
              color={ color }
              iconSize={ size } />
          ),
          tabBarLabel: () => null,
        } } />
    </Tab.Navigator>
  );
}