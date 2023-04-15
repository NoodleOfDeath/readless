import { Platform } from 'react-native';

import VersionCheck from 'react-native-version-check';

export function getUserAgent() {
  const userAgent = { 
    ...Platform,
    currentBuildNumber: VersionCheck.getCurrentBuildNumber(),
    currentVersion: VersionCheck.getCurrentVersion(),
  };
  return userAgent;
}