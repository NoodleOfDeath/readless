import React from 'react';
import { DeviceEventEmitter, Linking } from 'react-native';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
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
import InAppReview from 'react-native-in-app-review';
import { OrientationType } from 'react-native-orientation-locker';
import {
  DefaultTheme,
  MD3DarkTheme,
  PaperProvider,
} from 'react-native-paper';

import {
  ActivityIndicator,
  Badge,
  ChannelIcon,
  DrawerItem,
  DrawerSection,
  DrawerToggle,
  Icon,
  MediaPlayer,
  Screen,
  SearchMenu,
  Text,
  View,
} from '~/components';
import {
  LayoutContext,
  MediaContext,
  SessionContext,
} from '~/contexts';
import {
  useCategoryClient,
  useNavigation,
  useTheme,
} from '~/hooks';
import { strings } from '~/locales';
import {
  BookmarksScreen,
  CategoryScreen,
  ColorSchemePickerScreen,
  FontPickerScreen,
  HomeScreen,
  LegalScreen,
  NAVIGATION_LINKING_OPTIONS,
  OldNewsScreen,
  PublisherScreen,
  ReadingFormatPickerScreen,
  RecapScreen,
  SearchScreen,
  SettingsScreen,
  ShortPressFormatPickerScreen,
  StackableTabParams,
  StatsScreen,
  SummaryScreen,
  TestScreen,
  TriggerWordPickerScreen,
} from '~/screens';
import { getUserAgent } from '~/utils';

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
    options: { 
      headerBackTitle: '',
      headerLeft: () => <DrawerToggle />,
      headerTitle: () => <SearchMenu />,
    },
  },
  {
    component: SearchScreen, 
    name: 'search',
    options: { 
      headerBackTitle: '',
      headerTitle: '', 
    },
  },
  {
    component: SummaryScreen, 
    name: 'summary',  
    options: { 
      headerBackTitle: '',
      headerTitle: '', 
    },
  },
  {
    component: CategoryScreen, 
    name: 'category',
    options: { 
      headerBackTitle: '', 
      headerTitle: '', 
    },
  },
  {
    component: PublisherScreen, 
    name: 'publisher',
    options: {
      headerBackTitle: '', 
      headerTitle: '', 
    },
  },
  // Drawer Tab
  {
    component: BookmarksScreen, 
    name: 'bookmarks', 
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_bookmarks, 
    }, 
  }, 
  // Old News
  {
    component: OldNewsScreen,
    name: 'oldNews',  
    options: {
      headerBackTitle: '', 
      headerTitle: '', 
    },
  },
  {
    component: RecapScreen,
    name: 'recap',  
    options: {
      headerBackTitle: '',
      headerTitle: '', 
    },
  },
  // Settings
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
    component: ColorSchemePickerScreen, 
    name: 'colorSchemePicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_colorScheme, 
    },
  },
  {
    component: FontPickerScreen,
    name: 'fontPicker',  
    options: {
      headerBackTitle: '',
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
    component: ShortPressFormatPickerScreen,
    name: 'shortPressFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_preferredShortPressFormat, 
    },
  },
  {
    component: ReadingFormatPickerScreen,
    name: 'readingFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_preferredReadingFormat, 
    },
  },
  {
    component: LegalScreen, 
    name: 'legal', 
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_legal, 
    },
  },
  // Other
  {
    component: StatsScreen,
    name: 'stats',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined,
      headerTitle: 'stats', 
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
    <Stack.Navigator initialRouteName={ initialRouteName }>
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

function DrawerContent(props: DrawerContentComponentProps) {
  
  const {
    router,
    navigate,
    openCategory,
    openPublisher,
  } = useNavigation();

  const {
    bookmarkCount,
    unreadBookmarkCount,
    categories,
    publishers,
    followedCategories,
    followedPublishers,
  } = React.useContext(SessionContext);
  
  const {
    isTablet,
    lockRotation,
    unlockRotation,
  } = React.useContext(LayoutContext);

  const [loadedInitialUrl, setLoadedInitialUrl] = React.useState(false);

  React.useEffect(() => {
    const subscriber = Linking.addEventListener('url', router);
    if (!loadedInitialUrl) {
      Linking.getInitialURL().then((url) => {
        if (url) {
          router({ url } );
          setLoadedInitialUrl(true);
        }
      });
    }
    return () => subscriber.remove();
  }, [router, loadedInitialUrl]);

  React.useEffect(() => {
    if (!isTablet) {
      lockRotation(OrientationType.PORTRAIT);
    } else {
      unlockRotation();
    }
  }, [isTablet, lockRotation, unlockRotation]);
  
  const publisherItems = React.useMemo(() => {
    if (!publishers) {
      return [];
    }
    const items = Object.keys({ ...followedPublishers }).sort().map((p) => {
      const publisher = publishers[p];
      if (!publisher) {
        return undefined;
      }
      return (
        <DrawerItem
          key={ publisher.name }
          label={ publisher.displayName }
          icon={ (props) => <ChannelIcon { ...props } publisher={ publisher } /> }
          onPress={ () => openPublisher(publisher) } />
      );
    }).filter(Boolean);
    if (items.length === 0) {
      items.push(
        <DrawerItem 
          key="missing-publishers"
          label={ (
            <Text flex={ 1 } numberOfLines={ 3 }>
              { strings.misc_noPublishers }
            </Text>
          ) } />
      );
    }
    items.push(
      <DrawerItem 
        key="browse-publishers"
        label={ strings.nav_browsePublishers }
        onPress={ () => SheetManager.show('custom-feed-walkthrough') }
        right={ (props) => <Icon { ...props } name="menu-right" /> } />
    );
    return items;
  }, [publishers, followedPublishers, openPublisher]);
  
  const categoryItems = React.useMemo(() => {
    if (!categories) {
      return [];
    }
    const items = Object.keys({ ...followedCategories }).sort().map((c) => {
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
    if (items.length === 0) {
      items.push(
        <DrawerItem 
          key="missing-categories"
          label={ (
            <Text flex={ 1 } numberOfLines={ 3 }>
              { strings.misc_noCategories }
            </Text>
          ) } />
      );
    }
    items.push(
      <DrawerItem 
        key="browse-categories"
        label={ strings.nav_browseCategories }
        onPress={ () => SheetManager.show('custom-feed-walkthrough') }
        right={ (props) => <Icon { ...props } name="menu-right" /> } />
    );
    return items;
  }, [categories, followedCategories, openCategory]);
  
  return (
    <DrawerContentScrollView { ...props }>
      <DrawerItem 
        label={ getUserAgent().currentVersion }
        onLongPress={ () => SheetManager.show('onboarding-walkthrough') } />
      <DrawerSection 
        title={ strings.misc_publishers }>
        {publisherItems}
      </DrawerSection>
      <DrawerSection
        title={ strings.misc_categories }>
        {categoryItems}
      </DrawerSection>
      <DrawerSection>
        <DrawerItem
          label={ `${strings.screens_bookmarks} (${bookmarkCount})` }
          icon={ (props) => (
            <React.Fragment>
              {unreadBookmarkCount > 0 && (
                <Badge topLeft small>
                  {unreadBookmarkCount}
                </Badge>
              )}
              <Icon { ...props } name="bookmark" />
            </React.Fragment>
          ) }
          onPress= { () => navigate('bookmarks') } />
        <DrawerItem
          label={ strings.screens_settings }
          icon={ (props) => <Icon { ...props } name="cog" /> }
          onPress= { () => navigate('settings') } />
      </DrawerSection>
    </DrawerContentScrollView>
  );
}

const DrawerNav = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <DrawerNav.Navigator 
      initialRouteName={ strings.screens_home }
      screenOptions={ ({ route: _route }) => ({
        headerShown: false,
        swipeEnabled: false,
      }) }
      drawerContent={ (props) => <DrawerContent { ...props } /> }>
      <DrawerNav.Screen 
        name={ strings.screens_home } 
        component={ HomeDrawer } />
    </DrawerNav.Navigator>
  );
}

function LandingPage() {
  return (
    <Screen safeArea={ false }>
      <DrawerNavigation />
    </Screen>
  );
}

export default function NavigationController() {
  
  const theme = useTheme();
  const { getCategories, getPublishers } = useCategoryClient();
  
  const {
    ready, 
    categories,
    publishers,
    setCategories, 
    setPublishers,
    viewedFeatures,
    hasReviewed,
    readSummaries,
    lastRequestForReview,
    setPreference,
  } = React.useContext(SessionContext); 
  
  const { currentTrack } = React.useContext(MediaContext);
  
  const [lastFetch, setLastFetch] = React.useState(0);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  const [launchedTime] = React.useState(Date.now());

  const [showedReview, setShowedReview] = React.useState(false);
  const [showedOnboarding, setShowedOnboarding] = React.useState(false);
  
  const inAppReviewHandler = React.useCallback(() => {
    // make sure user has been using the app for at least 5 minutes before
    // requesting to review
    if (showedReview || hasReviewed || 
      Date.now() - launchedTime < ms('5m') || 
      Date.now() - lastRequestForReview < ms('2w') ||
      Object.keys({ ...readSummaries }).length < 3 ||
      !InAppReview.isAvailable()) {
      return;
    }
    setShowedReview(true);
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
  }, [hasReviewed, lastRequestForReview, launchedTime, readSummaries, setPreference, showedReview]);

  React.useEffect(() => {
    if (!ready) {
      return;
    }
    // in-app review handlers
    const reviewHandlerA = DeviceEventEmitter.addListener('follow-category', inAppReviewHandler);
    const reviewHandlerB = DeviceEventEmitter.addListener('follow-publisher', inAppReviewHandler);
    const reviewHandlerC = DeviceEventEmitter.addListener('bookmark-summary', inAppReviewHandler);
    const reviewHandlerD = DeviceEventEmitter.addListener('read-summary', inAppReviewHandler);
    return () => {
      reviewHandlerA.remove();
      reviewHandlerB.remove();
      reviewHandlerC.remove();
      reviewHandlerD.remove();
    };
  }, [ready, inAppReviewHandler]);
  
  const refreshSources = React.useCallback(() => {
    if (lastFetchFailed && (lastFetch < Date.now() - ms('10s'))) {
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
  
  React.useEffect(() => {
    if (!ready) {
      return;
    }
    if (lastFetchFailed && (lastFetch < Date.now() - ms('10s'))) {
      setTimeout(refreshSources, ms('10s'));
    } else {
      refreshSources();
    }
    if (!('onboarding-walkthrough' in ({ ...viewedFeatures }))) {
      if (showedOnboarding) {
        return;
      }
      setShowedOnboarding(true);
      SheetManager.show('onboarding-walkthrough');
    }
  }, [viewedFeatures, ready, refreshSources, lastFetchFailed, lastFetch, showedOnboarding]);
  
  const currentTheme = React.useMemo(() => theme.isDarkMode ? MD3DarkTheme : DefaultTheme, [theme.isDarkMode]);

  return (
    <NavigationContainer
      theme= { theme.navContainerTheme }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      <PaperProvider theme={ currentTheme }>
        <SheetProvider>
          <LandingPage />
          <MediaPlayer visible={ Boolean(currentTrack) } />
        </SheetProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

