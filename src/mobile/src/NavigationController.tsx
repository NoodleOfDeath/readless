import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Badge } from 'react-native-paper';

import {
  MediaContext,
  Preferences,
  SessionContext,
} from './contexts';

import {
  ActivityIndicator,
  Icon,
  MediaPlayer,
  View,
} from '~/components';
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
    const { tracks } = React.useContext(MediaContext);
    return (
      <View col>
        <Stack.Navigator initialRouteName={ initialRouteName }>
          {Object.entries(tabs).map(([name, component]) => (
            <Stack.Screen
              key={ name }
              name={ name as keyof T }
              component={ component }
              options={ { headerShown: false } } />
          ))}
        </Stack.Navigator>
        <MediaPlayer visible={ tracks.length > 0 } />
      </View>
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
    icon: 'home',
    name: 'Today',
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
  // {
  //   component: TabViewController<StackableTabParams>(
  //     {
  //       default: BulletinScreen, 
  //       search: SearchScreen, 
  //       summary: SummaryScreen,
  //     }
  //   ),
  //   icon: 'pin',
  //   name: 'Bulletin',
  // },
  {
    component: TabViewController({ default: SettingsScreen }),
    icon: 'cog',
    name: 'Settings',
  },
];

export default function NavigationController() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();
  const { ready, preferences } = React.useContext(SessionContext);
  return (
    <React.Fragment>
      {!ready ? (
        <ActivityIndicator animating />
      ) : (
        <View col>
          <NavigationContainer
            theme={ { 
              colors: theme.navContainerColors,
              dark: !theme.isLightMode,
            } }
            fallback={ <ActivityIndicator animating /> }
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
        </View>
      )}
    </React.Fragment>
  );
}