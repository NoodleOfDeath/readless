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

const SCREENS: RouteConfig<
  TabParams,
  keyof TabParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase,
>[] = [
  { 
    component: SearchScreen, 
    initialParams: { },
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
];

function Stack() {
  
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
            <Badge
              size={ 18 }
              style={ {
                position: 'absolute', right: -5, top: -5, zIndex: 1,
              } }>
              {bookmarkCount}
            </Badge>
          )}
          <Icon name='bookmark-outline' size={ 24 } />
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
      <Stack.Navigator initialRouteName={ 'default' }>
        {SCREENS.map((screen) => (
          <Stack.Screen
            key={ String(screen.name) }
            { ...screen }
            options={ { 
              headerRight: () => headerRight,
              headerShown: true,
              tabBarStyle: { display: 'none' },
              ...screen.options,
            } } />
        ))}
      </Stack.Navigator>
      <MediaPlayer visible={ Boolean(currentTrack) } />
    </View>
  );
  
}

export default function NavigationController() {
  const theme = useTheme();
  const { ready } = React.useContext(SessionContext);
  return (
    <NavigationContainer
      theme= { theme.navContainerTheme }
      fallback={ <ActivityIndicator animating /> }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      {!ready ? (
        <ActivityIndicator animating />
      ) : (
        <Stack />
      )}
    </NavigationContainer>
  );
}

