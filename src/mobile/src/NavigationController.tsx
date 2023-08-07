import React from 'react';
import { DeviceEventEmitter } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import ms from 'ms';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';
import InAppReview from 'react-native-in-app-review';
import {
  DefaultTheme,
  MD3DarkTheme,
  PaperProvider,
} from 'react-native-paper';

import { RightDrawerScreen } from './RightDrawerScreen';

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

export default function NavigationController() {
  
  const theme = useTheme();
  const { getCategories, getPublishers } = useApiClient();
  
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
  const {
    isTablet,
    lockRotation,
    unlockRotation,
  } = React.useContext(LayoutContext);
  
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
    if (!isTablet) {
      lockRotation(OrientationType.PORTRAIT);
    } else {
      unlockRotation();
    }
    return () => {
      reviewHandlerA.remove();
      reviewHandlerB.remove();
      reviewHandlerC.remove();
      reviewHandlerD.remove();
    };
  }, [ready, inAppReviewHandler, isTablet, lockRotation, unlockRotation]);
  
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
    if (!('onboarding-walkthrough' in ({ ...viewedFeatures }))) {
      if (showedOnboarding) {
        return;
      }
      setShowedOnboarding(true);
      SheetManager.show('onboarding-walkthrough');
    }
  }, [viewedFeatures, ready, refreshSources, lastFetchFailed, lastFetch, showedOnboarding]);
  
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
          <Screen safeArea={ false }>
            <RightDrawerScreen />
          </Screen>
          <MediaPlayer visible={ Boolean(currentTrack) } />
        </SheetProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}

