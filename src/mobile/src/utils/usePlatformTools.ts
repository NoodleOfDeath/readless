import React from 'react';
import {
  AccessibilityInfo,
  DeviceEventEmitter,
  Platform,
} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import VersionCheck from 'react-native-version-check';

import {
  StorageEventName,
  StorageMutation,
  StorageState,
} from '~/contexts';
import * as Localization from '~/locales';

export function usePlatformTools() {

  const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);
  const [needsUpdate, setNeedsUpdate] = React.useState(false);

  const getUserAgent = () => {
    const userAgent = { 
      ...Platform,
      currentBuildNumber: VersionCheck.getCurrentBuildNumber(),
      currentVersion: VersionCheck.getCurrentVersion(),
      locale: Localization.getLocale(),
    };
    return userAgent;
  };

  const emitStorageEvent = async <E extends StorageEventName>(event: E, mutation?: StorageMutation<E>, state?: StorageState<E>) => {
    if (!__DEV__) {
      const version = await VersionCheck.getLatestVersion();
      if (VersionCheck.getCurrentVersion() < version) {
        analytics().logEvent(event.replace(/-/g, '_'), {
          build: VersionCheck.getCurrentBuildNumber(),
          locale: Localization.getLocale(),
          mutation: JSON.stringify(mutation ?? '').slice(0, 100),
          platform: Platform.OS,
          version: VersionCheck.getCurrentVersion(),
        });
      }
    }
    DeviceEventEmitter.emit(event, mutation, state);
  };

  const onMount = async () => {
    setNeedsUpdate((await VersionCheck.needUpdate()).isNeeded);
  };

  React.useEffect(() => {
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReaderEnabled);
    onMount();
    return () => subscription.remove();
  }, []);

  return {
    emitStorageEvent,
    getUserAgent,
    needsUpdate,
    screenReaderEnabled,
  };

}