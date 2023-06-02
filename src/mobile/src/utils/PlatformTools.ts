import { Platform } from 'react-native';

import VersionCheck from 'react-native-version-check';

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

export { decode as atob } from 'js-base64';