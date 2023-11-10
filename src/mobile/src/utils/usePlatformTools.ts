import React from 'react';
import {
  AccessibilityInfo,
  DeviceEventEmitter,
  Platform,
} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import VersionCheck from 'react-native-version-check';

import {
  PreferenceMutation,
  PreferenceState,
  StorageEventName,
} from '~/contexts';
import * as Localization from '~/locales';

export function usePlatformTools() {

  const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);

  const getUserAgent = () => {
    const userAgent = { 
      ...Platform,
      currentBuildNumber: VersionCheck.getCurrentBuildNumber(),
      currentVersion: VersionCheck.getCurrentVersion(),
      locale: Localization.getLocale(),
    };
    return userAgent;
  };

  const emitEvent = async <E extends StorageEventName>(event: E, mutation?: PreferenceMutation<E>, state?: PreferenceState<E>) => {
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

  React.useEffect(() => {
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReaderEnabled);
    return () => subscription.remove();
  }, []);

  return {
    emitEvent,
    getUserAgent,
    screenReaderEnabled,
  };

}