import React from 'react';
import { Linking, useColorScheme } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  DarkTheme,
  DefaultTheme,
  EventMapBase,
  NavigationContainer,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { BottomNavigation, adaptNavigationTheme } from 'react-native-paper';
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
import { useNavigation } from '~/hooks';
import {
  BrowseScreen,
  ChannelScreen,
  MyStuffScreen,
  NAVIGATION_LINKING_OPTIONS,
  SearchScreen,
  StackableTabParams,
  SummaryScreen,
  TabParams,
} from '~/screens';

export function TabViewController<T extends TabParams = TabParams>(
  tabs: RouteConfig<T,
  keyof T,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase>[], 
  initialRouteName?: Extract<keyof T, string>
) {
  const Controller = () => {
    const Stack = createNativeStackNavigator<T>();
    const { currentTrack } = React.useContext(MediaContext);
    const { preferences: { loadedInitialUrl }, setPreference } = React.useContext(SessionContext);

    const { router } = useNavigation();

    React.useEffect(() => {
      const subscriber = Linking.addEventListener('url', router);
      if (!loadedInitialUrl) {
        Linking.getInitialURL().then((url) => {
          if (url) {
            router({ url } );
            setPreference('loadedInitialUrl', true);
          }
        });
      } 
      return () => subscriber.remove();
    }, [router, loadedInitialUrl, setPreference]);
  
    return (
      <View col>
        <Stack.Navigator initialRouteName={ initialRouteName }>
          {tabs.map((tab) => (
            <Stack.Screen
              key={ String(tab.name) }
              { ...tab }
              options={ { 
                headerShown: false,
                ...tab.options,
              } } />
          ))}
        </Stack.Navigator>
        <MediaPlayer visible={ Boolean(currentTrack) } />
      </View>
    );
  };
  return Controller;
}

type TabProps = {
  component: ReturnType<typeof TabViewController>;
  icon: string;
  name: string;
  disabled?: boolean;
  badge?: (preferences: Preferences) => number;
};

const TABS: TabProps[] = [
  {
    component: TabViewController<StackableTabParams>(
      [
        { 
          component: SearchScreen, 
          initialParams: { sampler: true },
          name:'default', 
          options: { headerTitle: 'Headlines' },
        }, 
        { component: SearchScreen, name: 'search' },
        { component: SummaryScreen, name: 'summary' },
        { component: ChannelScreen, name: 'channel' },
        { component: MyStuffScreen, name: 'bookmarks' },
        {
          component: BrowseScreen, name: 'browse', options: { headerTitle: 'Browse' },
        },
      ],
      'default'
    ),
    icon: 'newspaper',
    name: 'Headlines',
  },
  {
    component: TabViewController<StackableTabParams>(
      [
        {
          component: SearchScreen, 
          initialParams: { onlyCustomNews: true }, 
          name:'default', 
          options: { headerTitle: 'My News' },
        },
        { component: SearchScreen, name: 'search' },
        { component: SummaryScreen, name: 'summary' },
        { component: ChannelScreen, name: 'channel' },
        {
          component: MyStuffScreen, name: 'bookmarks', options: { headerTitle: 'My Stuff' }, 
        },
        {
          component: BrowseScreen, name: 'browse', options: { headerTitle: 'Browse' },
        },
      ],
      'default'
    ),
    icon: 'cards',
    name: 'My News',
  },
  {
    component: TabViewController<StackableTabParams>(
      [
        {
          component: BrowseScreen, 
          name:'default', 
          options: { headerTitle: 'Browse' },
        },
        { component: SearchScreen, name: 'search' },
        { component: SummaryScreen, name: 'summary' },
        { component: ChannelScreen, name: 'channel' },
        {
          component: MyStuffScreen, name: 'bookmarks', options: { headerTitle: 'My Stuff' }, 
        },
        {
          component: BrowseScreen, name: 'browse', options: { headerTitle: 'Browse' },
        },
      ],
      'default'
    ),
    icon: 'bookshelf',
    name: 'Browse',
  },
];

export default function NavigationController() {
  const colorScheme = useColorScheme();
  const theme = React.useMemo(() => colorScheme === 'dark' ? adaptNavigationTheme({ reactNavigationDark: DarkTheme }).DarkTheme : adaptNavigationTheme({ reactNavigationLight: DefaultTheme }).LightTheme, [colorScheme]);
  const Tab = createBottomTabNavigator();
  const { ready, preferences } = React.useContext(SessionContext);
  return (
    <NavigationContainer
      theme={ theme }
      fallback={ <ActivityIndicator animating /> }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      {!ready ? (
        <ActivityIndicator animating />
      ) : (
        <Tab.Navigator
          tabBar={ ({
            navigation, state, descriptors, insets, 
          }) => (
            <BottomNavigation.Bar
              navigationState={ state }
              safeAreaInsets={ insets }
              onTabPress={ ({ route, preventDefault }) => {
                const event = navigation.emit({
                  canPreventDefault: true,
                  target: route.key,
                  type: 'tabPress',
                });
                if (event.defaultPrevented) {
                  preventDefault();
                } else {
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                  });
                }
              } }
              renderIcon={ ({
                route, focused, color, 
              }) => {
                const { options } = descriptors[route.key];
                if (options.tabBarIcon) {
                  return options.tabBarIcon({
                    color, focused, size: 24, 
                  });
                }
                return null;
              } }
              getLabelText={ ({ route }) => route.name } />
          ) }>
          {TABS.filter((tab) => !tab.disabled).map((tab) => (
            <Tab.Screen
              key={ tab.name }
              name={ tab.name }
              component={ tab.component }
              options={ {
                headerShown: false,
                tabBarIcon: (props) => {
                  const badge = tab.badge ? tab.badge(preferences) : 0;
                  return (
                    <View>
                      {badge > 0 && (
                        <Badge style={ {
                          position: 'absolute', right: -5, top: -5, zIndex: 1,
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
      )}
    </NavigationContainer>
  );
}