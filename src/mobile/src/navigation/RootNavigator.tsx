import React from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import ms from 'ms';
import { SheetProvider } from 'react-native-actions-sheet';
import InAppReview from 'react-native-in-app-review';
import {
  DefaultTheme,
  MD3DarkTheme,
  PaperProvider,
} from 'react-native-paper';

import { RoutedScreen } from './RoutedScreen';
import { StackNavigator } from './StackNavigator';
import { TabbedNavigator } from './TabbedNavigator';
import { LOGIN_STACK } from './stacks';

import {
  ActivityIndicator,
  MediaPlayer,
  Screen,
  Text,
  View,
} from '~/components';
import {
  LayoutContext,
  MediaContext,
  NotificationContext,
  OrientationType,
  StorageContext,
} from '~/contexts';
import { useTheme } from '~/hooks';
import { NAVIGATION_LINKING_OPTIONS } from '~/screens';
import { usePlatformTools } from '~/utils';

export function RootNavigator() {
  
  const { emitStorageEvent } = usePlatformTools();
  const theme = useTheme();
  
  const storage = React.useContext(StorageContext);
  const {
    ready, 
    isSyncingWithRemote,
    categories,
    publishers,
    setCategories, 
    setPublishers,
    lastRequestForReview = 0,
    readSummaries,
    pushNotificationsEnabled,
    setStoredValue,
    userData,
    api: {
      getCategories, getPublishers, updateMetadata,
    },
  } = storage;
  const {
    isTablet,
    lockRotation,
    unlockRotation,
  } = React.useContext(LayoutContext);
  
  const { isRegisteredForRemoteNotifications, registerRemoteNotifications } = React.useContext(NotificationContext);
  const { currentTrack } = React.useContext(MediaContext);
  
  const [lastFetch, setLastFetch] = React.useState(0);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);

  const [showedReview, setShowedReview] = React.useState(false);

  React.useEffect(() => {
    if (!ready) {
      return;
    }
    if (!userData?.valid) {
      return;
    }

    if (!isTablet) {
      lockRotation(OrientationType.PORTRAIT);
    } else {
      unlockRotation();
    }
    if (pushNotificationsEnabled !== false && !isRegisteredForRemoteNotifications()) {
      registerRemoteNotifications();
    }

    if (!showedReview && 
      (Date.now() - lastRequestForReview > ms('2w') && 
      (Object.keys({ ...readSummaries }).length > 2))) {

      const inAppReviewHandler = async () => {
        try {
          const available = InAppReview.isAvailable();
          if (!available) {
            emitStorageEvent('in-app-review-failed', 'unavailable');
            return;
          }
          let success = false;
          if (Platform.OS === 'ios') {
            success = await InAppReview.RequestInAppReview();
          } else {
            success = await InAppReview.requestInAppCommentAppGallery();
          }
          setShowedReview(success);
          emitStorageEvent(success ? 'in-app-review' : 'in-app-review-failed');
          setStoredValue('lastRequestForReview', Date.now());
        } catch (error) {
          console.error(error);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          emitStorageEvent('in-app-review-failed', JSON.stringify(error));
        }
      };

      // in-app review handlers
      const reviewHandlerA = DeviceEventEmitter.addListener('follow-category', inAppReviewHandler);
      const reviewHandlerB = DeviceEventEmitter.addListener('follow-publisher', inAppReviewHandler);
      const reviewHandlerC = DeviceEventEmitter.addListener('bookmark-summary', inAppReviewHandler);
      const reviewHandlerD = DeviceEventEmitter.addListener('read-summary', inAppReviewHandler);
      const reviewHandlerE = DeviceEventEmitter.addListener('read-recap', inAppReviewHandler);

      return () => {
        reviewHandlerA.remove();
        reviewHandlerB.remove();
        reviewHandlerC.remove();
        reviewHandlerD.remove();
        reviewHandlerE.remove();
      };

    }
  }, [ready, isTablet, lockRotation, showedReview, lastRequestForReview, unlockRotation, readSummaries, setStoredValue, emitStorageEvent, registerRemoteNotifications, pushNotificationsEnabled, isRegisteredForRemoteNotifications, updateMetadata, userData]);
  
  const refreshSources = React.useCallback(() => {
    if (!ready) {
      return;
    }
    if (!userData?.valid) {
      return;
    }
    if (lastFetchFailed || (Date.now() - lastFetch < ms('10s'))) {
      return;
    }
    if (!categories) {
      getCategories().then((response) => {
        setCategories(Object.fromEntries(response.data.rows.map((row) => [row.name, row])));
      }).catch((error) => {
        console.log(error); 
        setLastFetchFailed(true);
      }).finally(() => {
        setLastFetch(Date.now());
      });
    }
    if (!publishers) {
      getPublishers().then((response) => {
        setPublishers(Object.fromEntries(response.data.rows.map((row) => [row.name, row])));
      }).catch((error) => {
        console.log(error);
        setLastFetchFailed(true);
      }).finally(() => {
        setLastFetch(Date.now());
      });
    }
  }, [categories, getCategories, getPublishers, lastFetch, lastFetchFailed, publishers, ready, setCategories, setPublishers, userData?.valid]);

  React.useEffect(() => refreshSources(), [refreshSources]);
  
  const currentTheme = React.useMemo(() => theme.isDarkMode ? MD3DarkTheme : DefaultTheme, [theme.isDarkMode]);

  if (!ready) {
    const text = isSyncingWithRemote ? 'Syncing with remote...' : 'Loading...';
    return (
      <Screen>
        <View
          p={ 24 }
          gap={ 12 }
          itemsCenter
          justifyCenter>
          <ActivityIndicator />
          <Text textCenter>
            {text}
          </Text>
        </View>
      </Screen>
    );
  }
   
  return (
    <NavigationContainer
      theme= { theme.navContainerTheme }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      <PaperProvider theme={ currentTheme }>
        <SheetProvider>
          {(userData?.valid || userData?.unlinked) ? (
            <React.Fragment>
              <TabbedNavigator />
              <MediaPlayer visible={ Boolean(currentTrack) } />
            </React.Fragment>
          ) : (
            <RoutedScreen safeArea={ false } navigationID='loginStackNav'>
              <StackNavigator
                id="loginStackNav" 
                screens={ LOGIN_STACK }
                screenOptions={ { headerShown: false } } />
            </RoutedScreen>
          )}
        </SheetProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

