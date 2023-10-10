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
  SessionContext,
  SessionEvent,
} from '~/contexts';
import * as Localization from '~/locales';

export function usePlatformTools() {

  const { latestVersion = '', setStoredValue } = React.useContext(SessionContext);
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

  const emitEvent = React.useCallback(async <E extends SessionEvent>(event: E, mutation?: PreferenceMutation<E>, state?: PreferenceState<E>) => {
    const version = latestVersion || await VersionCheck.getLatestVersion();
    if (!latestVersion) {
      setStoredValue('latestVersion', version);
    }
    if (!__DEV__ && VersionCheck.getCurrentVersion() <= version) {
      analytics().logEvent(event.replace(/-/g, '_'), {
        build: VersionCheck.getCurrentBuildNumber(),
        locale: Localization.getLocale(),
        mutation: JSON.stringify(mutation ?? '').slice(0, 100),
        platform: Platform.OS,
        version: VersionCheck.getCurrentVersion(),
      });
    }
    DeviceEventEmitter.emit(event, mutation, state);
  }, [latestVersion, setStoredValue]);

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