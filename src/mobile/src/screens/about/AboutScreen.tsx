import React from 'react';

import VersionCheck from 'react-native-version-check';

import {
  Screen,
  Text,
  View,
} from '~/components';
import { strings } from '~/locales';

export function AboutScreen() {
  return (
    <Screen>
      <View p={ 12 }>
        <Text h1>{strings.misc_readless}</Text>
        <Text>{VersionCheck.getCurrentVersion()}</Text>
      </View>
    </Screen>
  );
}