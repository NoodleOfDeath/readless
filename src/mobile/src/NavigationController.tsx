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
import ms from 'ms';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';
import { addScreenshotListener } from 'react-native-detector';
import { HoldMenuProvider } from 'react-native-hold-menu';

import {
  LayoutContext,
  MediaContext,
  SessionContext,
} from './contexts';
import { ArticleListScreen } from './screens/ArticleListScreen';

import {
  ActivityIndicator,
  Button,
  Icon,
  MediaPlayer,
  Screen,
  View,
} from '~/components';
import {
  useCategoryClient,
  useNavigation,
  useTheme,
} from '~/hooks';
import { strings } from '~/locales';
import {
  AboutScreen,
  BookmarksScreen,
  BrowseScreen,
  CategoryScreen,
  ColorSchemePickerScreen,
  FontPickerScreen,
  HomeScreen,
  NAVIGATION_LINKING_OPTIONS,
  PublisherScreen,
  ReadingFormatPickerScreen,
  RecapScreen,
  SearchScreen,
  SettingsScreen,
  StackableTabParams,
  SummaryScreen,
  TestScreen,
  TriggerWordPickerScreen,
} from '~/screens';

const screens: RouteConfig<
  StackableTabParams,
  keyof StackableTabParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
  // Home Tab
  {
    component: HomeScreen, 
    name: 'home',
    options: { headerBackTitle: '' },
  },
  {
    component: SearchScreen, 
    name: 'search',
    options: { headerBackTitle: '' },
  },
  {
    component: SummaryScreen, 
    name: 'summary',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
    },
  },
  {
    component: CategoryScreen, 
    name: 'category',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
    }, 
  },
  {
    component: PublisherScreen, 
    name: 'publisher',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
    }, 
  },
  {
    component: ArticleListScreen, 
    name: 'articles',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
    },
  },
  {
    component: BrowseScreen, 
    name: 'browse', options: {
      headerBackTitle: '', 
      headerRight: () => undefined, 
      headerTitle: strings.screens_browse, 
    },
  },
  // Settings Tab
  {
    component: SettingsScreen, 
    name: 'settings', 
    options: {
      headerBackTitle: '', 
      headerRight: () => undefined, 
      headerTitle: strings.screens_settings, 
    },
  },
  {
    component: AboutScreen, 
    name: 'about', 
    options: {
      headerBackTitle: '', 
      headerRight: () => undefined, 
      headerTitle: strings.screens_about, 
    },
  },
  {
    component: BookmarksScreen, 
    name: 'bookmarks', 
    options: {
      headerBackTitle: '', 
      headerRight: () => undefined, 
      headerTitle: strings.screens_bookmarks, 
    }, 
  },
  {
    component: ColorSchemePickerScreen, 
    name: 'colorSchemePicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.screens_colorScheme, 
    },
  },
  {
    component: FontPickerScreen,
    name: 'fontPicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.screens_font, 
    },
  },
  {
    component: TriggerWordPickerScreen,
    name: 'triggerWordPicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.screens_triggerWords, 
    },
  },
  {
    component: ReadingFormatPickerScreen,
    name: 'readingFormatPicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.screens_preferredReadingFormat, 
    },
  },
  {
    component: RecapScreen,
    name: 'recaps',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.screens_recaps, 
    },
  },
  {
    component: TestScreen,
    name: 'test',
    options: {
      headerBackTitle: '', 
      headerRight: () => undefined,
      headerTitle: 'test', 
    },
  },
];

const Stack = createNativeStackNavigator();

function StackNavigation({ initialRouteName = 'default' }: { initialRouteName?: string } = {}) {

  const { router } = useNavigation();
  const { getCategories, getPublishers } = useCategoryClient();
  const { setCategories, setPublishers } = React.useContext(SessionContext);

  const {
    bookmarkCount,
    loadedInitialUrl,
    viewedFeatures,
    categories,
    publishers,
    followedCategories,
    setPreference,
  } = React.useContext(SessionContext);
  
  const {
    lockRotation,
    rotationLock,
    unlockRotation,
  } = React.useContext(LayoutContext);

  const [lastFetch, setLastFetch] = React.useState(0);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);

  const _categoryTabs = React.useMemo(() => {
    return Object.keys({ ...followedCategories }).filter((c) => typeof c === 'object').map((category) => (
      <Tab.Screen 
        key={ category }
        name={ category }
        component={ PublisherScreen }
        options={ {
          tabBarIcon: ({ color }) => (
            categories?.[category]?.icon && (
              <Icon 
                name={ categories[category].icon } 
                color={ color } />
            )
          ),
        } }
        initialParams={ { 
          attributes: category,
          type: 'category',
        } } />
    ));
  }, [categories, followedCategories]);

  React.useEffect(() => {
    if (bookmarkCount > 0 && !('bookmark-walkthrough' in { ...viewedFeatures })) {
      SheetManager.show('bookmark-walkthrough');
    }
  }, [bookmarkCount, viewedFeatures]);

  const screenshotListener = React.useCallback(async () => {
    if ('sharing-walkthrough' in { ...viewedFeatures }) {
      return;
    }
    SheetManager.hideAll();
    setTimeout(() => SheetManager.show('sharing-walkthrough'), 1000);
  }, [viewedFeatures]);

  React.useEffect(() => {
    if ('sharing-walkthrough' in { ...viewedFeatures }) {
      return;
    }
    const unsubscribe = addScreenshotListener(screenshotListener);
    return () => {
      unsubscribe();
    };
  }, [screenshotListener, viewedFeatures]);

  React.useEffect(() => {
    if (lastFetchFailed && lastFetch < Date.now() - ms('20s')) {
      return;
    }
    if (!categories || lastFetch < Date.now() - ms('1h')) {
      getCategories().then((response) => {
        setCategories(Object.fromEntries(response.data.rows.map((row) => [row.name, row])));
      }).catch((error) => {
        console.log(error);
        setLastFetchFailed(true);
      }).finally(() => {
        setLastFetch(Date.now());
      });
    }
    if (!publishers || lastFetch < Date.now() - ms('1h')) {
      getPublishers().then((response) => {
        setPublishers(Object.fromEntries(response.data.rows.map((row) => [row.name, row])));
      }).catch((error) => {
        console.log(error);
        setLastFetchFailed(true);
      }).finally(() => {
        setLastFetch(Date.now());
      });
    }
  }, [categories, getCategories, getPublishers, lastFetch, lastFetchFailed, publishers, setCategories, setPublishers]);
  
  const headerRight = React.useMemo(() => {
    return (
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
        </View>
      </View>
    );
  }, [rotationLock, unlockRotation, lockRotation]);
  
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
        initialRouteName={ initialRouteName }>
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
    </View>
  );
  
}

function TabScreen({ initialRouteName }: { initialRouteName?: string } = {}) {
  return (
    <Screen>
      <StackNavigation initialRouteName={ initialRouteName } />
    </Screen>
  );
}

function HomeTab() {
  return <TabScreen />; 
}

function ProfileTab() {
  return <TabScreen initialRouteName="settings" />; 
}

const TAB_ICONS = {
  [strings.screens_home]: 'home',
  [strings.screens_profile]: 'account',
};

const Tab = createBottomTabNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={ ({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarIcon: ({ color, size }) => {
          return (
            <Icon 
              name={ TAB_ICONS[route.name] } 
              size={ size } 
              color={ color } />
          );
        },
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      }) }>
      <Tab.Screen 
        name={ strings.screens_home } 
        component={ HomeTab } />
      <Tab.Screen 
        name={ strings.screens_profile } 
        component={ ProfileTab } />
    </Tab.Navigator>
  );
}

export default function NavigationController() {
  const theme = useTheme();
  const { currentTrack } = React.useContext(MediaContext);
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
        <HoldMenuProvider
          theme={ theme.isDarkMode ? 'dark' : 'light' }
          safeAreaInsets={ {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          } }>
          <SheetProvider>
            <TabNavigation />
            <MediaPlayer visible={ Boolean(currentTrack) } />
          </SheetProvider>
        </HoldMenuProvider>
      )}
    </NavigationContainer>
  );
}

