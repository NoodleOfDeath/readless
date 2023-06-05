import React from 'react';

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
        <Text h1>{strings.readless}</Text>
      </View>
    </Screen>
  );
}