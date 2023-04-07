import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { Icon } from '~/components';
import { useTheme } from '~/hooks';
import { NAVIGATION_LINKING_OPTIONS, ScreenProps } from '~/screens';
import {
  MyStuffTab,
  NewsTab,
  SearchTab,
  SettingsTab,
} from '~/tabs';

const TABS: ScreenProps[] = [
  // {
  //   component: DiscoverTab,
  //   icon: 'fire',
  //   name: 'Discover',
  // },
  {
    component: NewsTab,
    icon: 'newspaper',
    name: 'News',
  },
  {
    component: MyStuffTab,
    icon: 'bookmark-multiple',
    name: 'My Stuff',
  },
  {
    component: SearchTab,
    icon: 'magnify',
    name: 'Search',
  },
  {
    component: SettingsTab,
    icon: 'cog',
    name: 'Settings',
  },
];

export default function NavigationController() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer
      theme={ { 
        colors: theme.navContainerColors,
        dark: !theme.isLightMode,
      } }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      <Tab.Navigator
        initialRouteName="search"
        screenOptions={ { headerShown: true } }>
        {TABS.map((screen) => (
          <Tab.Screen
            key={ screen.name }
            name={ screen.name }
            component={ screen.component }
            options={ {
              headerRight: screen.headerRight,
              tabBarIcon: (props) => (
                <Icon name={ screen.icon } { ...props } color="primary" />
              ),
            } } />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}