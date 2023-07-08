import React from 'react';
import { Linking } from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
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
import InAppReview from 'react-native-in-app-review';

import {
  LayoutContext,
  MediaContext,
  SessionContext,
} from './contexts';

import {
  ActivityIndicator,
  Button,
  ChannelIcon,
  Divider, 
  Header,
  Icon,
  MediaPlayer,
  Screen,
  SearchMenu,
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
  return (
    <Stack.Navigator
      initialRouteName={ initialRouteName }
      screenOptions={ ({ route }) => ({
        header: route.name === 'home' ? () => ( 
          <Header>
            <SearchMenu flexGrow={ 1 } />
          </Header>
        ) : undefined,
      }) }>
      {screens.map((screen) => (
        <Stack.Screen
          key={ String(screen.name) }
          { ...screen }
          options={ { 
            headerShown: true,
            ...screen.options,
          } } />
      ))}
    </Stack.Navigator>
  );
  
}

function TabScreen({ initialRouteName }: { initialRouteName?: string } = {}) {
  return (
    <Screen>
      <StackNavigation initialRouteName={ initialRouteName } />
    </Screen>
  );
}

function HomeDrawer() {
  return <TabScreen />;
}

const Drawer = createDrawerNavigator();

function DrawerContent(props) {
  
  const { 
    router,
    openCategory,
    openPublisher,
  } = useNavigation();
  const { getCategories, getPublishers } = useCategoryClient();
  const { setCategories, setPublishers } = React.useContext(SessionContext);

  const {
    bookmarkCount,
    loadedInitialUrl,
    viewedFeatures,
    categories,
    publishers,
    followedCategories,
    followedPublishers,
    hasReviewed,
    lastRequestForReview,
    setPreference,
  } = React.useContext(SessionContext);
  
  const {
    lockRotation,
    rotationLock,
    unlockRotation,
  } = React.useContext(LayoutContext);

  const [lastFetch, setLastFetch] = React.useState(0);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  const [showedBookmarks, setShowedBookmarks] = React.useState(false);

  React.useEffect(() => {
    if (showedBookmarks) {
      return;
    }
    setShowedBookmarks(true);
    if (bookmarkCount > 0 && !('bookmark-walkthrough' in { ...viewedFeatures })) {
      SheetManager.show('bookmark-walkthrough');
    }
    if (InAppReview.isAvailable() && (!hasReviewed || Date.now() - lastRequestForReview > ms('2w'))) {
      setTimeout(() => {
        InAppReview.RequestInAppReview()
          .then((hasFlowFinishedSuccessfully) => {
            if (hasFlowFinishedSuccessfully) {
              setPreference('hasReviewed', true);
              setPreference('lastRequestForReview', Date.now());
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }, 5_000);
    }
  }, [bookmarkCount, showedBookmarks, viewedFeatures, hasReviewed, lastRequestForReview, setPreference]);

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
  
  const categoryItems = React.useMemo(() => {
    if (!categories) {
      return [];
    }
    return Object.keys({ ...followedCategories }).sort().map((c) => {
      const category = categories[c];
      if (!category) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ category.name }
          label={ category.displayName }
          icon={ (props) => <Icon { ...props } name={ category.icon } /> }
          onPress={ () => openCategory(category) } />
      );
    }).filter(Boolean);
  }, [categories, followedCategories]);
  
  const publisherItems = React.useMemo(() => {
    if (!publishers) {
      return [];
    }
    return Object.keys({ ...followedPublishers }).sort().map((p) => {
      const publisher = publishers[p];
      if (!publisher) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ publisher.name }
          label={ publisher.displayName }
          icon={ (props) => <ChannelIcon publisher={ publisher } /> }
          onPress={ () => openPublisher(publisher) } />
      );
    }).filter(Boolean);
  }, [publishers, followedPublishers]);
  
  return (
    <DrawerContentScrollView { ...props }>
      <DrawerItemList { ...props } />
      <Divider />
      {categoryItems}
      <Divider />
      {publisherItems}
    </DrawerContentScrollView>
  );
}

function DrawerNavigation() {
  return (
    <Drawer.Navigator 
      initialRouteName={ strings.screens_home }
      screenOptions={ { headerShown: false } }
      drawerContent={ (props) => <DrawerContent { ...props } /> }>
      <Drawer.Screen 
        name={ strings.screens_home } 
        component={ HomeDrawer } />
    </Drawer.Navigator>
  );
}

function LandingPage() {
  return (
    <Screen>
      <DrawerNavigation />
    </Screen>
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
            <LandingPage />
            <MediaPlayer visible={ Boolean(currentTrack) } />
          </SheetProvider>
        </HoldMenuProvider>
      )}
    </NavigationContainer>
  );
}

