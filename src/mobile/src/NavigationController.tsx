import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Badge } from 'react-native-paper';

import { Preferences, SessionContext } from './contexts';

import { Icon, View } from '~/components';
import { useTheme } from '~/hooks';
import {
  HomeScreen,
  MyStuffScreen,
  NAVIGATION_LINKING_OPTIONS,
  ScreenComponentType,
  SearchScreen,
  SectionsScreen,
  SettingsScreen,
  StackableTabParams,
  SummaryScreen,
  TabParams,
} from '~/screens';

export function TabViewController<T extends TabParams = TabParams>(
  tabs: { [key in keyof T]: ScreenComponentType<T, keyof T> }, 
  initialRouteName?: Extract<keyof T, string>
) {
  const Controller = () => {
    const Stack = createNativeStackNavigator<T>();
    return (
      <Stack.Navigator initialRouteName={ initialRouteName }>
        {Object.entries(tabs).map(([name, component]) => (
          <Stack.Screen
            key={ name }
            name={ name as keyof T }
            component={ component }
            options={ { headerShown: false } } />
        ))}
      </Stack.Navigator>
    );
  };
  return Controller;
}

type TabProps = {
  component: ReturnType<typeof TabViewController>;
  icon: string;
  name: string;
  badge?: (preferences: Preferences) => number;
};

const TABS: TabProps[] = [
  {
    component: TabViewController<StackableTabParams>(
      {
        default: HomeScreen, 
        search: SearchScreen, 
        summary: SummaryScreen,
      }
    ),
    icon: 'fire',
    name: 'Hot off Press',
  },
  {
    badge: (preferences) => Object.keys(preferences.bookmarkedSummaries ?? {}).filter((summary) => !(summary in (preferences.readSummaries ?? {}))).length ?? 0,
    component: TabViewController<StackableTabParams>(
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
    component: TabViewController<StackableTabParams>(
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

  const { preferences } = React.useContext(SessionContext);

  return (
    <NavigationContainer
      theme={ { 
        colors: theme.navContainerColors,
        dark: !theme.isLightMode,
      } }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      <Tab.Navigator>
        {TABS.map((tab) => (
          <Tab.Screen
            key={ tab.name }
            name={ tab.name }
            component={ tab.component }
            options={ {
              tabBarIcon: (props) => {
                const badge = tab.badge ? tab.badge(preferences) : 0;
                return (
                  <View>
                    {badge > 0 && (
                      <Badge style={ {
                        position: 'absolute', right: 0, top: 0, zIndex: 1,
                      } }>
                        {badge}
                      </Badge>
                    )}
                    <Icon name={ tab.icon } { ...props } color="primary" />
                  </View>
                );
              },
            } } />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}