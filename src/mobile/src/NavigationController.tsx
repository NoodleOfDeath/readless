import React from 'react';
import { Linking } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  EventMapBase,
  NavigationContainer,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Badge } from 'react-native-paper';

import {
  MediaContext,
  Preferences,
  SessionContext,
} from './contexts';

import {
  ActivityIndicator,
  Button,
  Icon,
  MediaPlayer,
  View,
} from '~/components';
import { useNavigation, useTheme } from '~/hooks';
import { strings } from '~/locales';
import {
  BookmarksScreen,
  BrowseScreen,
  ChannelScreen,
  NAVIGATION_LINKING_OPTIONS,
  SearchScreen,
  SettingsScreen,
  StackableTabParams,
  SummaryScreen,
  TabParams,
} from '~/screens';
import { lengthOf } from '~/utils';

export function TabViewController<T extends TabParams = TabParams>(
  tabs: RouteConfig<
    T,
    keyof T,
    NavigationState,
    NativeStackNavigationOptions,
    EventMapBase
  >[], 
  initialRouteName?: Extract<keyof T, string>
) {
  const Controller = () => {
    const Stack = createNativeStackNavigator<T>();
    const { currentTrack } = React.useContext(MediaContext);
    const {
      preferences: { 
        bookmarkedSummaries,
        readSummaries,
        loadedInitialUrl,
      },
      setPreference,
    } = React.useContext(SessionContext);

    const { 
      router, 
      openBookmarks,
      openSettings, 
    } = useNavigation();
    
    const bookmarkCount = React.useMemo(() => lengthOf(Object.keys(bookmarkedSummaries ?? {}).filter((k) => !(k in (readSummaries ?? {})))), [bookmarkedSummaries, readSummaries]);
    
    const headerRight = React.useMemo(() => (
      <View>
        <View row gap={ 16 } alignCenter>
          <View onPress={ openBookmarks }>
            {bookmarkCount > 0 && (
              <Badge style={ {
                position: 'absolute', right: -5, top: -5, zIndex: 1,
              } }>
                {bookmarkCount}
              </Badge>
            )}
            <Icon name='bookmark' size={ 24 } />
          </View>
          <Button
            startIcon="menu"
            iconSize={ 24 }
            onPress={ openSettings } />
        </View>
      </View>
    ), [bookmarkCount, openBookmarks, openSettings]);

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
                headerRight: () => headerRight,
                headerShown: true,
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
          name: 'default', 
          options: { headerTitle: strings.headlines },
        }, 
        { component: SearchScreen, name: 'search' },
        {
          component: BrowseScreen, name: 'browse', options: { headerTitle: strings.browse },
        },
        { component: SummaryScreen, name: 'summary' },
        { component: ChannelScreen, name: 'channel' },
        {
          component: BookmarksScreen, name: 'bookmarks', options: { headerTitle: strings.bookmarks.bookmarks }, 
        },
        {
          component: SettingsScreen, name: 'settings', options: { headerTitle: strings.settings.settings },
        },
      ],
      'default'
    ),
    icon: 'newspaper',
    name: strings.headlines,
  },
  {
    component: TabViewController<StackableTabParams>(
      [
        {
          component: SearchScreen, 
          initialParams: { onlyCustomNews: true }, 
          name: 'default', 
          options: { headerTitle: strings.myNews },
        },
        { component: SearchScreen, name: 'search' },
        {
          component: BrowseScreen, name: 'browse', options: { headerTitle: strings.browse },
        },
        { component: SummaryScreen, name: 'summary' },
        { component: ChannelScreen, name: 'channel' },
        {
          component: BookmarksScreen, name: 'bookmarks', options: { headerTitle: strings.bookmarks.bookmarks }, 
        },
        {
          component: SettingsScreen, name: 'settings', options: { headerTitle: strings.settings.settings },
        },
      ],
      'default'
    ),
    icon: 'cards',
    name: strings.myNews,
  },
  {
    component: TabViewController<StackableTabParams>(
      [
        {
          component: BrowseScreen, 
          name:'default', 
          options: { headerTitle: strings.browse },
        },
        { component: SearchScreen, name: 'search' },
        {
          component: BrowseScreen, name: 'browse', options: { headerTitle: strings.browse },
        },
        { component: SummaryScreen, name: 'summary' },
        { component: ChannelScreen, name: 'channel' },
        {
          component: BookmarksScreen, name: 'bookmarks', options: { headerTitle: strings.bookmarks.bookmarks }, 
        },
        {
          component: SettingsScreen, name: 'settings', options: { headerTitle: strings.settings.settings },
        },
      ],
      'default'
    ),
    icon: 'bookshelf',
    name: strings.browse,
  },
];

export default function NavigationController() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();
  const { ready, preferences } = React.useContext(SessionContext);
  const initialRouteName = React.useMemo(() => {
    return lengthOf(preferences.bookmarkedCategories, preferences.bookmarkedOutlets) > 0 ? strings.myNews : strings.headlines;
  }, [preferences.bookmarkedCategories, preferences.bookmarkedOutlets]);
  return (
    <NavigationContainer
      theme= { theme.navContainerTheme }
      fallback={ <ActivityIndicator animating /> }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      {!ready ? (
        <ActivityIndicator animating />
      ) : (
        <Tab.Navigator initialRouteName={ initialRouteName }>
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