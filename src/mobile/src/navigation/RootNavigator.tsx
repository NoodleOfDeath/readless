import React from 'react';
import {
  DeviceEventEmitter,
  Linking,
  Platform,
} from 'react-native';

import { APP_STORE_LINK, PLAY_STORE_LINK } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import ms from 'ms';
import { SheetProvider } from 'react-native-actions-sheet';
import InAppReview from 'react-native-in-app-review';

import { LeftDrawerNavigator } from './LeftDrawerNavigator';
import { RoutedScreen } from './RoutedScreen';
import { StackNavigator } from './StackNavigator';
import { LOGIN_STACK } from './stacks';

import {
  ActivityIndicator,
  Button,
  Dialog,
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
  ToastContext,
} from '~/contexts';
import { useAppState, useTheme } from '~/hooks';
import { strings } from '~/locales';
import { NAVIGATION_LINKING_OPTIONS } from '~/screens';
import { usePlatformTools } from '~/utils';

export function RootNavigator() {
  
  const { emitStorageEvent, needsUpdate } = usePlatformTools();
  const theme = useTheme();
  
  const {
    isTablet,
    lockRotation,
    unlockRotation,
  } = React.useContext(LayoutContext);
  const storage = React.useContext(StorageContext);
  const {
    api: { updateMetadata },
    ready, 
    isFetching,
    lastRequestForReview = 0,
    readSummaries,
    pushNotificationsEnabled,
    userData,
    setStoredValue,
    setErrorHandler,
    syncWithRemote,
  } = storage;
  const { showToast } = React.useContext(ToastContext);
  
  const { isRegisteredForRemoteNotifications, registerRemoteNotifications } = React.useContext(NotificationContext);
  const { currentTrack } = React.useContext(MediaContext);
  
  const [lastSync, setLastSync] = React.useState(0);

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error);
          showToast(error?.errorKey ?? error?.message ?? 'Unknown error');
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
  }, [ready, isTablet, lockRotation, showedReview, lastRequestForReview, unlockRotation, readSummaries, setStoredValue, emitStorageEvent, registerRemoteNotifications, pushNotificationsEnabled, isRegisteredForRemoteNotifications, updateMetadata, userData, showToast]);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setErrorHandler((e: any) => {
      console.error(e);
      showToast(e);
    });
  }, [setErrorHandler, showToast]);
  
  useAppState({
    onForeground: React.useCallback(async () => {
      if (lastSync > Date.now() - ms('2m')) {
        return;
      }
      await syncWithRemote();
      setLastSync(Date.now());
    }, [syncWithRemote, lastSync]),
  });
  
  if (!ready) {
    return (
      <Screen>
        <View
          p={ 24 }
          gap={ 12 }
          itemsCenter
          justifyCenter>
          <ActivityIndicator />
          <Text textCenter>
            {isFetching ? strings.syncing : strings.loading}
          </Text>
        </View>
      </Screen>
    );
  }

  if (needsUpdate) {
    return (
      <Dialog
        visible
        title={ strings.aNewVersionIsAvailable }
        actions={ [
          <Button
            contained
            key="ok"
            onPress={ () => {
              Linking.openURL(Platform.select({ android: PLAY_STORE_LINK, ios: APP_STORE_LINK }) ?? '');
            } }>
            {strings.update}

          </Button>,
        ] }>
        <Text>{strings.pleaseUpdateToContinue}</Text>
      </Dialog>
    );
  }

  return (
    <NavigationContainer
      theme= { theme.navContainerTheme }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      <SheetProvider>
        {(userData?.valid || userData?.unlinked) ? (
          <React.Fragment>
            <LeftDrawerNavigator />
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
    </NavigationContainer>
  );
}

