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

import { StackNavigator } from './StackNavigator';
import { TabbedNavigator } from './TabbedNavigator';
import { LOGIN_STACK } from './stacks';

import {
  ActivityIndicator,
  MediaPlayer,
  Screen,
} from '~/components';
import {
  LayoutContext,
  MediaContext,
  NotificationContext,
  OrientationType,
  SYNCABLE_SETTINGS,
  Storage,
  StorageContext,
  SyncableIoIn,
  SyncableIoOut,
} from '~/contexts';
import { useApiClient, useTheme } from '~/hooks';
import { NAVIGATION_LINKING_OPTIONS } from '~/screens';
import { usePlatformTools } from '~/utils';

export function RootNavigator() {
  
  const { emitEvent } = usePlatformTools();
  const theme = useTheme();
  const {
    getCategories, getPublishers, updateMetadata, getProfile,
  } = useApiClient();
  
  const storage = React.useContext(StorageContext);
  const {
    ready, 
    categories,
    publishers,
    setCategories, 
    setPublishers,
    lastRequestForReview = 0,
    readSummaries,
    pushNotificationsEnabled,
    setStoredValue,
    userData,
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
  const [hasSyncedPrefs, setHasSyncedPrefs] = React.useState(false);

  const [showedReview, setShowedReview] = React.useState(false);

  const onPrefsChanged = React.useCallback((key: keyof Storage) => {
    if (!userData) {
      return;
    }
    if (!SYNCABLE_SETTINGS.includes(key)) {
      return;
    }
    const localValue = storage[key];
    try {
      const trans = SyncableIoOut(key);
      const value = trans(localValue);
      updateMetadata({ 
        key, 
        value: value as unknown as object,
      });
    } catch (e) {
      console.log(localValue);
      console.error(e);
    }
  }, [storage, updateMetadata, userData]);

  const syncPrefs = React.useCallback(async() => {
    if (!userData) {
      return;
    }
    if (hasSyncedPrefs) {
      return;
    }
    const { data, error } = await getProfile();
    if (error) {
      console.error(error);
      return;
    }
    const { profile } = data;
    if (!profile) {
      return;
    }
    console.log('syncing prefs');
    for (const key of SYNCABLE_SETTINGS) {
      const remoteValue = profile.preferences?.[key];
      console.log('updating', key, remoteValue);
      try {
        const trans = SyncableIoIn(key);
        const value = trans(remoteValue);
        setStoredValue(key, value, false);
      } catch (e) {
        console.log(remoteValue);
        console.error(e);
      }
    }
  }, [getProfile, setStoredValue, userData]);

  React.useEffect(() => {
    if (!ready) {
      return;
    }

    if (!userData) {
      return;
    }

    if (!hasSyncedPrefs) {
      setHasSyncedPrefs(true);
      syncPrefs();
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
            emitEvent('in-app-review-failed', 'unavailable');
            return;
          }
          let success = false;
          if (Platform.OS === 'ios') {
            success = await InAppReview.RequestInAppReview();
          } else {
            success = await InAppReview.requestInAppCommentAppGallery();
          }
          setShowedReview(success);
          emitEvent(success ? 'in-app-review' : 'in-app-review-failed');
          setStoredValue('lastRequestForReview', Date.now());
        } catch (error) {
          console.error(error);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          emitEvent('in-app-review-failed', JSON.stringify(error));
        }
      };

      // in-app review handlers
      const reviewHandlerA = DeviceEventEmitter.addListener('follow-category', inAppReviewHandler);
      const reviewHandlerB = DeviceEventEmitter.addListener('follow-publisher', inAppReviewHandler);
      const reviewHandlerC = DeviceEventEmitter.addListener('bookmark-summary', inAppReviewHandler);
      const reviewHandlerD = DeviceEventEmitter.addListener('read-summary', inAppReviewHandler);
      const reviewHandlerE = DeviceEventEmitter.addListener('read-recap', inAppReviewHandler);

      const prefHandler = DeviceEventEmitter.addListener('set-preference', onPrefsChanged);

      return () => {
        reviewHandlerA.remove();
        reviewHandlerB.remove();
        reviewHandlerC.remove();
        reviewHandlerD.remove();
        reviewHandlerE.remove();
        prefHandler.remove();
      };

    } else {
      const prefHandler = DeviceEventEmitter.addListener('set-preference', onPrefsChanged);
      return () => {
        prefHandler.remove();
      };
    }
  }, [ready, isTablet, lockRotation, showedReview, lastRequestForReview, unlockRotation, readSummaries, setStoredValue, emitEvent, registerRemoteNotifications, pushNotificationsEnabled, isRegisteredForRemoteNotifications, updateMetadata, onPrefsChanged, syncPrefs, hasSyncedPrefs, userData]);
  
  const refreshSources = React.useCallback(() => {
    if (!userData) {
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
  }, [categories, getCategories, getPublishers, lastFetch, lastFetchFailed, publishers, setCategories, setPublishers, userData]);

  React.useEffect(() => refreshSources(), [refreshSources]);
  
  const currentTheme = React.useMemo(() => theme.isDarkMode ? MD3DarkTheme : DefaultTheme, [theme.isDarkMode]);

  if (!ready) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }
   
  return (
    <NavigationContainer
      theme= { theme.navContainerTheme }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      <PaperProvider theme={ currentTheme }>
        <SheetProvider>
          {userData ? (
            <React.Fragment>
              <TabbedNavigator />
              <MediaPlayer visible={ Boolean(currentTrack) } />
            </React.Fragment>
          ) : (
            <Screen>
              <StackNavigator
                id="loginStackNav" 
                screens={ LOGIN_STACK }
                screenOptions={ { headerShown: false } } />
            </Screen>
          )}
        </SheetProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

