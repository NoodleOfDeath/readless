import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Icon } from '~/components';
import { useTheme } from '~/hooks';
import {
  MyStuffScreen,
  NAVIGATION_LINKING_OPTIONS,
  SearchScreen,
  SectionsScreen,
  SettingsScreen,
  SummaryScreen,
} from '~/screens';
import { StackableTabParams } from '~/screens';

export function TabViewController(
  tabs: { [key in keyof StackableTabParams]?: React.ComponentType }, 
  initialRouteName: keyof StackableTabParams = 'default'
) {
  const Controller = () => {
    const Stack = createNativeStackNavigator<StackableTabParams>();
    return (
      <Stack.Navigator initialRouteName={ initialRouteName }>
        {Object.entries(tabs).map(([name, component]) => (
          <Stack.Screen
            key={ name }
            name={ name as keyof StackableTabParams }
            component={ component }
            options={ { headerShown: false } } />
        ))}
      </Stack.Navigator>
    );
  };
  return Controller;
}

const TABS = [
  {
    component: TabViewController(
      {
        default: SearchScreen, 
        search: SearchScreen, 
        summary: SummaryScreen,
      }
    ),
    icon: 'fire',
    name: 'Hot off Press',
  },
  {
    component: TabViewController(
      {
        default: MyStuffScreen, 
        search: SearchScreen, 
        summary: SummaryScreen,
      }
    ),
    icon: 'bookmark-multiple',
    name: 'My Stuff',
  },
  {
    component: TabViewController(
      {
        default: SectionsScreen, 
        search: SearchScreen, 
        summary: SummaryScreen,
      }
    ),
    icon: 'newspaper',
    name: 'Sections',
  },
  {
    component: TabViewController({ default: SettingsScreen }),
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
        initialRouteName="realtimeTab">
        {TABS.map((tab) => (
          <Tab.Screen
            key={ tab.name }
            name={ tab.name }
            component={ tab.component }
            options={ {
              tabBarIcon: (props) => (
                <Icon name={ tab.icon } { ...props } color="primary" />
              ),
            } } />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}