import { DeviceEventEmitter, Platform } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import VersionCheck from 'react-native-version-check';

import {
  PreferenceMutation,
  PreferenceState,
  SessionEvent,
} from '~/contexts';
import * as Localization from '~/locales';

export function getUserAgent() {
  const userAgent = { 
    ...Platform,
    currentBuildNumber: VersionCheck.getCurrentBuildNumber(),
    currentVersion: VersionCheck.getCurrentVersion(),
    locale: Localization.getLocale(),
  };
  return userAgent;
}

export function emitEvent<E extends SessionEvent>(event: E, mutation?: PreferenceMutation<E>, state?: PreferenceState<E>) {
  analytics().logEvent(event.replace(/-/g, '_'), {
    mutation,
    state,
    userAgent: getUserAgent(),
  });
  DeviceEventEmitter.emit(event, mutation, state);
}