import React from 'react';

import {
  Screen,
  TriggerWordPicker,
  View,
} from '~/components';

export function TriggerWordPickerScreen() {
  return (
    <Screen>
      <View p={ 24 }>
        <TriggerWordPicker />
      </View>
    </Screen>
  );
}