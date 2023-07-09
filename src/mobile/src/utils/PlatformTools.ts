import { DeviceEventEmitter, Platform } from 'react-native';

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

export function emitEvent<E extends SessionEvent>(event: E, mutation: PreferenceMutation<E>, state: PreferenceState<E>) {
  DeviceEventEmitter.emit(event, mutation, state);
}