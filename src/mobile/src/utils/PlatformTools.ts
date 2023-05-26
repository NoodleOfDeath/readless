import { Platform } from 'react-native';

import VersionCheck from 'react-native-version-check';

import * as Localization from '~/locales';

export function getUserAgent() {
  const userAgent = { 
    ...Platform,
    currentBuildNumber: VersionCheck.getCurrentBuildNumber(),
    currentVersion: VersionCheck.getCurrentVersion(),
  };
  return userAgent;
}

export const getLocale = Localization.getLocale;