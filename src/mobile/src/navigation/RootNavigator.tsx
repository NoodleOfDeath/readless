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
  Storage,
  StorageContext,
} from '~/contexts';
import { useApiClient, useTheme } from '~/hooks';
import { NAVIGATION_LINKING_OPTIONS } from '~/screens';
import { usePlatformTools } from '~/utils';

const SYNCABLE_KEYS: (keyof Storage)[] = [
  'followedPublishers',
  'favoritedPublishers',
  'favoritedCategories',
  'followedCategories',
  'readSummaries',
] as const;

type SyncableKey = typeof SYNCABLE_KEYS[number];

const SYNC_TRANSFORMATIONS: { [key in SyncableKey]?: ((value?: Storage[key]) => string) } = {
  favoritedCategories: (value) => JSON.stringify(Object.keys(value ?? {})),
  favoritedPublishers: (value) => JSON.stringify(Object.keys(value ?? {})),
  followedCategories: (value) => JSON.stringify(Object.keys(value ?? {})),
  followedPublishers: (value) => JSON.stringify(Object.keys(value ?? {})),
  readSummaries: (value) => JSON.stringify(value),
};

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
    if (!SYNCABLE_KEYS.includes(key)) {
      return;
    }
    const rawValue = storage[key];
    const trans = SYNC_TRANSFORMATIONS[key] as ((value?: Storage[typeof key]) => string) | undefined;
    const value = trans?.(rawValue);
    updateMetadata({ 
      key, 
      value: value as unknown as object,
    });
  }, [storage, updateMetadata]);

  const syncPrefs = React.useCallback(async() => {
    if (!userData) {
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
    for (const key of SYNCABLE_KEYS) {
      const remoteValue = profile.preferences?.[key];
      console.log('updating', key, remoteValue);
      if (key === 'readSummaries') {
        setStoredValue(key, JSON.parse(remoteValue), false);
      }
    }
  }, [getProfile, setStoredValue, userData]);

  React.useEffect(() => {
    if (!ready) {
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
  }, [ready, isTablet, lockRotation, showedReview, lastRequestForReview, unlockRotation, readSummaries, setStoredValue, emitEvent, registerRemoteNotifications, pushNotificationsEnabled, isRegisteredForRemoteNotifications, updateMetadata, onPrefsChanged, syncPrefs, hasSyncedPrefs]);
  
  const refreshSources = React.useCallback(() => {
    if (!userData) {
      return;
    }
    if (lastFetchFailed || (Date.now() - lastFetch < ms('10s'))) {
      return;
    }
    if (!categories || (Date.now() - lastFetch < ms('1h'))) {
      getCategories().then((response) => {
        setCategories(Object.fromEntries(response.data.rows.map((row) => [row.name, row])));
      }).catch((error) => {
        console.log(error);
        setLastFetchFailed(true);
      }).finally(() => {
        setLastFetch(Date.now());
      });
    }
    if (!publishers || (Date.now() - lastFetch < ms('1h'))) {
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

