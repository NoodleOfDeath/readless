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
import { addScreenshotListener } from 'react-native-detector';
import { Badge } from 'react-native-paper';

import {
  LayoutContext,
  MediaContext,
  SessionContext,
} from './contexts';
import { AboutScreen } from './screens/about/AboutScreen';
import { FEATURES } from './screens/search/WalkthroughStack';
import { FontPickerScreen } from './screens/settings/FontPickerScreen';
import { ReadingFormatPickerScreen } from './screens/settings/ReadingFormatPickerScreen';
import { TriggerWordPickerScreen } from './screens/settings/TriggerWordPickerScreen';

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
  ColorSchemePickerScreen,
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
      headerTitle: strings.menu_browse, 
    },
  },
  {
    component: BookmarksScreen, 
    name: 'bookmarks', 
    options: {
      headerBackTitle: '', 
      headerTitle: strings.bookmarks_header, 
    }, 
  },
  {
    component: BrowseScreen, 
    name: 'browse', options: {
      headerBackTitle: '', 
      headerTitle: strings.menu_browse, 
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
      headerTitle: strings.settings_settings, 
    },
  },
  {
    component: SummaryScreen, 
    name: 'summary',  
    options: { headerBackTitle: '' },
  },
  {
    component: ColorSchemePickerScreen, 
    name: 'colorSchemePicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.settings_colorScheme, 
    },
  },
  {
    component: FontPickerScreen,
    name: 'fontPicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.settings_font, 
    },
  },
  {
    component: TriggerWordPickerScreen,
    name: 'triggerWordPicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.settings_triggerWords, 
    },
  },
  {
    component: ReadingFormatPickerScreen,
    name: 'readingFormatPicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.settings_preferredReadingFormat, 
    },
  },
];

function Stack() {

  const { router } = useNavigation();

  const { currentTrack } = React.useContext(MediaContext);

  const {
    bookmarkCount,
    unreadBookmarkCount,
    loadedInitialUrl,
    viewedFeatures,
    setPreference,
  } = React.useContext(SessionContext);
  
  const {
    lockRotation,
    rotationLock,
    unlockRotation,
  } = React.useContext(LayoutContext);

  React.useEffect(() => {
    if (bookmarkCount > 0 && !('bookmark-walkthrough' in { ...viewedFeatures })) {
      SheetManager.show('bookmark-walkthrough');
    }
  }, [bookmarkCount, viewedFeatures]);

  React.useEffect(() => {
    if (!('sharing-walkthrough' in { ...viewedFeatures })) {
      const unsubscribe = addScreenshotListener(() => {
        if (!('sharing-walkthrough' in { ...viewedFeatures })) {
          SheetManager.show('sharing-walkthrough');
        }
        return () => {
          unsubscribe();
        };
      });
    }
  }, [viewedFeatures]);

  React.useEffect(() => {
    const viewed = { ...viewedFeatures };
    if (!('promo-code-walkthrough' in viewed) && FEATURES.every((f) => f.id in viewed)) {
      setTimeout(() => SheetManager.show('promo-code-walkthrough'), 2_000);
    }
  }, [viewedFeatures]);

  const Stack = createNativeStackNavigator();
  
  const headerRight = React.useMemo(() => (
    <View>
      <View row gap={ 16 } itemsCenter>
        <Button
          leftIcon={ (
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
          haptic
          onPress={ () => rotationLock ? unlockRotation() : lockRotation() } />
        {/* <View touchable onPress={ () => SheetManager.show('subscribe') }>
          <Icon
            name="tag"
            size={ 24 } />
          <Icon absolute name="currency-usd" size={ 12 } bottom={ -1 } left={ -3 } />
        </View> */}
        <View touchable onPress={ () => SheetManager.show('main-menu') }>
          {unreadBookmarkCount > 0 && (
            <Badge
              size={ 18 }
              style={ {
                position: 'absolute', right: -5, top: -5, zIndex: 1,
              } }>
              {unreadBookmarkCount}
            </Badge>
          )}
          <Icon name='menu' size={ 24 } />
        </View>
      </View>
    </View>
  ), [rotationLock, unreadBookmarkCount, unlockRotation, lockRotation]);
  
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
  const { ready, viewedFeatures } = React.useContext(SessionContext);
  React.useEffect(() => {
    if (!ready) {
      return;
    }
    if (!viewedFeatures || !('onboarding-walkthrough' in viewedFeatures)) {
      SheetManager.show('onboarding-walkthrough');
    }
  }, [viewedFeatures, ready]);
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
          <Stack />
        </SheetProvider>
      )}
    </NavigationContainer>
  );
}

