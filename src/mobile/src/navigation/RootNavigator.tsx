import React from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import ms from 'ms';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';
import InAppReview from 'react-native-in-app-review';
import {
  DefaultTheme,
  MD3DarkTheme,
  PaperProvider,
} from 'react-native-paper';

import { RightDrawerNavigator } from './RightDrawerNavigator';

import {
  ActivityIndicator,
  MediaPlayer,
  Screen,
} from '~/components';
import {
  LayoutContext,
  MediaContext,
  OrientationType,
  SessionContext,
} from '~/contexts';
import { useApiClient, useTheme } from '~/hooks';
import { NAVIGATION_LINKING_OPTIONS } from '~/screens';
import { usePlatformTools } from '~/utils';

export function RootNavigator() {
  
  const { emitEvent } = usePlatformTools();
  const theme = useTheme();
  const { getCategories, getPublishers } = useApiClient();
  
  const {
    ready, 
    categories,
    publishers,
    setCategories, 
    setPublishers,
    hasViewedFeature,
    lastRequestForReview = 0,
    readSummaries,
    setStoredValue,
  } = React.useContext(SessionContext);   
  const {
    isTablet,
    lockRotation,
    unlockRotation,
  } = React.useContext(LayoutContext);
  
  const { currentTrack } = React.useContext(MediaContext);
  
  const [lastFetch, setLastFetch] = React.useState(0);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);

  const [showedReview, setShowedReview] = React.useState(false);
  const [alreadyShowedOnboarding, setAlreadyShowedOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (!ready) {
      return;
    }
    if (!isTablet) {
      lockRotation(OrientationType.PORTRAIT);
    } else {
      unlockRotation();
    }
    if (!showedReview && 
      (Date.now() - lastRequestForReview > ms('2w') && 
      (Object.keys({ ...readSummaries }).length > 1))) {

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

      return () => {
        reviewHandlerA.remove();
        reviewHandlerB.remove();
        reviewHandlerC.remove();
        reviewHandlerD.remove();
        reviewHandlerE.remove();
      };

    }
  }, [ready, isTablet, lockRotation, showedReview, lastRequestForReview, unlockRotation, readSummaries, setStoredValue, emitEvent]);
  
  const refreshSources = React.useCallback(() => {
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
    if (!hasViewedFeature('onboarding-walkthrough')) {
      if (alreadyShowedOnboarding) {
        return;
      }
      SheetManager.show('onboarding-walkthrough');
      setAlreadyShowedOnboarding(true);
    }
  }, [hasViewedFeature, ready, refreshSources, lastFetchFailed, lastFetch, alreadyShowedOnboarding]);
  
  const currentTheme = React.useMemo(() => theme.isDarkMode ? MD3DarkTheme : DefaultTheme, [theme.isDarkMode]);

  return !ready ? (
    <Screen>
      <ActivityIndicator />
    </Screen>
  ) : (
    <NavigationContainer
      theme= { theme.navContainerTheme }
      linking={ NAVIGATION_LINKING_OPTIONS }>
      <PaperProvider theme={ currentTheme }>
        <SheetProvider>
          <RightDrawerNavigator />
          <MediaPlayer visible={ Boolean(currentTrack) } />
        </SheetProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

