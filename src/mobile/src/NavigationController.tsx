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
import { addScreenshotListener } from 'react-native-detector';
import { HoldMenuProvider } from 'react-native-hold-menu';
import InAppReview from 'react-native-in-app-review';

import {
  ActivityIndicator,
  Badge,
  Button,
  ChannelIcon,
  DrawerItem,
  DrawerSection,
  Header,
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
  // Recaps
  {
    component: RecapScreen,
    name: 'recaps',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.screens_recaps, 
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
    lockRotation,
    rotationLock,
    unlockRotation,
  } = React.useContext(LayoutContext);

  const [loadedInitialUrl, setLoadedInitialUrl] = React.useState(false);
  
  const _headerRight = React.useMemo(() => {
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
          setLoadedInitialUrl(true);
        }
      });
    } 
    return () => subscriber.remove();
  }, [router, loadedInitialUrl]);
  
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
      return [
        <DrawerItem 
          key="missing-publishers"
          label={ (
            <Text>
              { strings.misc_noPublishers }
            </Text>
          ) } />,
        <DrawerItem 
          key="browse-publishers"
          label={ strings.nav_browsePublishers }
          onPress={ () => SheetManager.show('custom-feed-walkthrough') }
          right={ (props) => <Icon { ...props } name="chevron-right" /> } />,
      ];
    }
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
      return [
        <DrawerItem 
          key="missing-categories"
          label={ (
            <Text>
              { strings.misc_noCategories }
            </Text>
          ) } />,
        <DrawerItem 
          key="browse-categories"
          label={ strings.nav_browseCategories }
          onPress={ () => SheetManager.show('custom-feed-walkthrough') }
          right={ (props) => <Icon { ...props } name="chevron-right" /> } />,
      ];
    }
    return items;
  }, [categories, followedCategories, openCategory]);
  
  return (
    <DrawerContentScrollView { ...props }>
      <DrawerItem label={ getUserAgent().currentVersion } />
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
    bookmarkCount,
    setCategories, 
    setPublishers,
    viewedFeatures,
    hasReviewed,
    lastRequestForReview,
    setPreference,
  } = React.useContext(SessionContext); 
  
  const { currentTrack } = React.useContext(MediaContext);
  
  const [lastFetch, setLastFetch] = React.useState(0);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  const [launchedTime] = React.useState(Date.now());
  const [showedBookmarks, setShowedBookmarks] = React.useState(false);

  // bookmarks walkthrough
  React.useEffect(() => {
    if (showedBookmarks) {
      return;
    }
    if (bookmarkCount > 0 && !('bookmark-walkthrough' in { ...viewedFeatures })) {
      SheetManager.show('bookmark-walkthrough');
      setShowedBookmarks(true);
    }
  }, [bookmarkCount, showedBookmarks, viewedFeatures]);
  
  const inAppReviewHandler = React.useCallback(() => {
    // make sure user has been using the app for at least 5 minutes before
    // requesting to review
    if (hasReviewed || 
      Date.now() - launchedTime < ms('5m') || 
      Date.now() - lastRequestForReview < ms('2w') ||
      !InAppReview.isAvailable()) {
      return;
    }
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
  }, [hasReviewed, lastRequestForReview, launchedTime, setPreference]);

  React.useEffect(() => {
    
    // feedback subscriber
    const unsubscribe = addScreenshotListener(() => {
      SheetManager.hideAll();
      setTimeout(() => SheetManager.show('feedback'), 1_000);
    });
  
    // in-app review handlers
    const reviewHandlerA = DeviceEventEmitter.addListener('follow-category', inAppReviewHandler);
    const reviewHandlerB = DeviceEventEmitter.addListener('follow-publisher', inAppReviewHandler);
    const reviewHandlerC = DeviceEventEmitter.addListener('bookmark-summary', inAppReviewHandler);
    
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
    
    return () => {
      unsubscribe();
      reviewHandlerA.remove();
      reviewHandlerB.remove();
      reviewHandlerC.remove();
    };
    
  }, [categories, getCategories, getPublishers, lastFetch, lastFetchFailed, publishers, setCategories, setPublishers, inAppReviewHandler]);
  
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

