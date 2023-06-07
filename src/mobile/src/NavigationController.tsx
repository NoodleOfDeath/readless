import React from 'react';
import { Linking } from 'react-native';

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
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';
import { Badge, Provider } from 'react-native-paper';

import {
  LayoutContext,
  MediaContext,
  SessionContext,
} from './contexts';
import { AboutScreen } from './screens/about/AboutScreen';

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
} from '~/screens';

const screens: RouteConfig<
StackableTabParams,
keyof StackableTabParams,
NavigationState,
NativeStackNavigationOptions,
EventMapBase
>[] = [
  {
    component: SearchScreen, 
    name: 'search',
    options: { headerBackTitle: '' },
  },
  {
    component: AboutScreen, 
    name: 'about', 
    options: {
      headerBackTitle: '', 
      headerTitle: strings.browse, 
    },
  },
  {
    component: BookmarksScreen, 
    name: 'bookmarks', 
    options: {
      headerBackTitle: '', 
      headerTitle: strings.bookmarks.bookmarks, 
    }, 
  },
  {
    component: BrowseScreen, 
    name: 'browse', options: {
      headerBackTitle: '', 
      headerTitle: strings.browse, 
    },
  },
  {
    component: ChannelScreen, 
    name: 'channel',
    options: { headerBackTitle: '' }, 
  },
  {
    component: SettingsScreen, 
    name: 'settings', 
    options: {
      headerBackTitle: '', 
      headerTitle: strings.settings.settings, 
    },
  },
  {
    component: SummaryScreen, 
    name: 'summary',  
    options: { headerBackTitle: '' },
  },
];

function Stack() {
  
  const Stack = createNativeStackNavigator();
  const { currentTrack } = React.useContext(MediaContext);
  const {
    bookmarkCount,
    loadedInitialUrl,
    setPreference,
  } = React.useContext(SessionContext);
  
  const {
    lockRotation,
    rotationLock,
    unlockRotation,
  } = React.useContext(LayoutContext);

  const { router } = useNavigation();
  
  const headerRight = React.useMemo(() => (
    <View>
      <View row gap={ 16 } alignCenter>
        <Button
          touchable
          startIcon={ (
            <View height={ 24 } width={ 24 }>
              <Icon 
                absolute
                name={ rotationLock ? 'lock-check' : 'lock-open' }
                size={ rotationLock ? 24 : 16 }
                top={ rotationLock ? 0 : -1 }
                right={ rotationLock ? 0 : -1 } />
              <Icon 
                absolute
                name='screen-rotation' 
                bottom={ -1 }
                left={ -1 }
                size={ 16 } />
            </View>
          ) }
          iconSize={ 24 }
          haptic
          onPress={ () => rotationLock ? unlockRotation() : lockRotation() } />
        {/* <View touchable onPress={ () => SheetManager.show('subscribe') }>
          <Icon
            name="tag"
            size={ 24 } />
          <Icon absolute name="currency-usd" size={ 12 } bottom={ -1 } left={ -3 } />
        </View> */}
        <View touchable onPress={ () => SheetManager.show('mainMenu') }>
          {bookmarkCount > 0 && (
            <Badge
              size={ 18 }
              style={ {
                position: 'absolute', right: -5, top: -5, zIndex: 1,
              } }>
              {bookmarkCount}
            </Badge>
          )}
          <Icon name='menu' size={ 24 } />
        </View>
      </View>
    </View>
  ), [rotationLock, bookmarkCount, unlockRotation, lockRotation]);
  
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
      <Stack.Navigator
        initialRouteName={ 'default' }>
        {screens.map((screen) => (
          <Stack.Screen
            key={ String(screen.name) }
            { ...screen }
            options={ { 
              headerRight: () => headerRight,
              headerShown: true,
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
      linking={ NAVIGATION_LINKING_OPTIONS }>
      {!ready ? (
        <View>
          <ActivityIndicator animating />
        </View>
      ) : (
        <SheetProvider>
          <Provider>          
            <Stack />
          </Provider>
        </SheetProvider>
      )}
    </NavigationContainer>
  );
}

